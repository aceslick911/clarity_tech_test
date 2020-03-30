// Purpose: Run GraphQL request from DB1 then save into DB2. Cache for 2 minutes in DB2
const { request } = require('graphql-request')
const MongoClient = require('mongodb').MongoClient;

var express = require('express');
var cors = require('cors');
var app = express();
app.use(cors());



let db_instance = null;
let db_client = null
let lastRequest = null;
const cacheTimeSeconds = 2;//60 * 5;

const initializeMongoConnection = () => new Promise((resolve, error) => {
    const url = 'mongodb://localhost:27018/db';
    const dbName = 'db';
    const client = new MongoClient(url, { useUnifiedTopology: true });

    // Use connect method to connect to the Server
    console.log("connecting...")
    client.connect((err) => {
        console.log(`DB Connected successfully to ${url}`);

        const db = client.db(dbName);

        const collection = db.collection('suppliers');
        collection.find()

        resolve({ db, client });

    })//.error(err => error(err));

})


initializeMongoConnection().then((connection) => {
    db_instance = connection.db;
    db_client = connection.client;
    console.log("DB Connection ready")
});

app.get('/', (req, res, next) => {

    const useCachedData = lastRequest != null && Number(Date.now()) < lastRequest + (cacheTimeSeconds * 1000);

    if (useCachedData) {
        console.log("Serving cachced data...")
        getCachedSupplierData(db_instance).then(data => {
            res.json(data);
        });
    } else {

        fetchDB1Data().catch(error => console.error(error))
            .then(calculateMessageRatios)
            .then(calculateCompletionRatios)
            .then(calculateFinalRating)
            .then(filterToWebRequest)
            .then(outputData => {
                if (!useCachedData) {
                    lastRequest = Number(Date.now());
                    console.log("Served fresh data...")
                    res.json(outputData)
                }
                cacheSupplierData(outputData, db_instance);
            })
    }

})

const terminateMongoConnection = (client) => {
    client.close();
}

const cacheSupplierData = (suppliers, db) => {
    const collection = db.collection('suppliers');

    collection.deleteMany({}, () => {
        collection.insertMany(suppliers, (err, result) => {
            console.log("Cached request");
        });
    });

}

const getCachedSupplierData = (db) => new Promise((resolve, err) => {
    const collection = db.collection('suppliers');
    collection.find().toArray(
        (err, result) => {
            result = result.map(supplier => (
                {
                    name: supplier.name,
                    rating: supplier.rating
                })
            );
            resolve(result)
        });
});

const server = app.listen(3001, () => {
    console.log('Listening on port %s', server.address().port)
})

const fetchDB1Data = async () => {
    const endpoint = 'http://localhost:4000/'

    const query = /* GraphQL */`
    {
        Suppliers(first: 1000) {
        nodes {
            name,
            messages_sent,
            messages_recv,
            workorders(first:100){
                nodes{
                    date_due,
                    date_completed,
                    priority
                }
            },
            
        }
        },
    }
    `

    const data = await request(endpoint, query)
    return data.Suppliers.nodes;

}

const calculateMessageRatios = async (suppliers) => {
    return suppliers.map(supplier => {
        return {
            ...supplier,
            messageRatio: supplier.messages_sent / supplier.messages_recv
        }
    })
}

const calculateCompletionRatios = async (suppliers) => {
    return suppliers.map(supplier => {
        const p1Jobs = supplier.workorders.nodes.filter(workOrder => workOrder.priority == 0);
        const p2Jobs = supplier.workorders.nodes.filter(workOrder => workOrder.priority == 1);
        const p3Jobs = supplier.workorders.nodes.filter(workOrder => workOrder.priority > 1);

        const calcCompleted = (jobs) => jobs.length == 0 ? 0 : (
            jobs.map(current => (Number(new Date(current.date_due)) > Number(new Date(current.date_completed)) ? 1 : 0))
                .reduce((total, active) => total + active)
        );

        const p1JobsCompleted = calcCompleted(p1Jobs);
        const p2JobsCompleted = calcCompleted(p2Jobs);
        const p3JobsCompleted = calcCompleted(p3Jobs);
        return {
            ...supplier,
            p1JobsCompleted,
            p2JobsCompleted,
            p3JobsCompleted,
            p1CompletionRatio: p1Jobs.length == 0 ? 0 : (p1JobsCompleted / p1Jobs.length),
            p2CompletionRatio: p2Jobs.length == 0 ? 0 : (p2JobsCompleted / p2Jobs.length),
            p3CompletionRatio: p3Jobs.length == 0 ? 0 : (p3JobsCompleted / p3Jobs.length),
        }

    })
}

const calculateFinalRating = async (suppliers) => {
    return suppliers.map(supplier => {
        const rating = 10 * (
            (Math.min(1, supplier.messageRatio)
                + supplier.p1CompletionRatio
                + (supplier.p2CompletionRatio * 0.6)
                + (supplier.p3CompletionRatio * 0.3)
            ) / (1 + 1 + 0.6 + 0.3)
        );
        return {
            ...supplier,
            rating: Math.round(rating * 10) / 10
        }
    })

}

const filterToWebRequest = async (suppliers) => {
    return suppliers.map(supplier => {
        return {
            name: supplier.name,
            rating: supplier.rating
        }
    });
}
