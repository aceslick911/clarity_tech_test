const MongoClient = require('mongodb').MongoClient;

const faker = require('faker');

const assert = require('assert');

// Connection URL
const url = 'mongodb://mongo/db';

// Database Name
const dbName = 'db';

// Create a new MongoClient
const client = new MongoClient(url, { useUnifiedTopology: true });

// Use connect method to connect to the Server
console.log("connecting...")
client.connect(function (err) {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    const db = client.db(dbName);
    insertDocuments(db, () => {
        client.close();
    })

});

const insertServices = (db, count) => {
    return new Promise((resolve, reject) => {
        const collection = db.collection('services');

        const services = []
        for (var i = 0; i < count; i++) {
            services.push({
                "description": faker.commerce.productMaterial(),
                "name": faker.commerce.product()
            })
        }

        collection.insertMany(services, (err, result) => {
            if (err != null) {
                console.log("ERROR", err);
                reject(err);
            }
            console.log("Added services");
            resolve({
                services,
                result
            });
        });


    })
}

const insertSuppliers = (db, count, services, serviceResults) => {

    return new Promise((resolve, reject) => {
        const collection = db.collection('suppliers');
        const map = serviceResults.insertedIds;

        const serviceList = [];
        for (var key in map) {
            serviceList.push(map[key]);
        }


        const suppliers = [];
        for (var i = 0; i <= count; i++) {

            const tempServiceList = [...serviceList]
            const removeCount = serviceList.length - 5;
            for (var ii = 0; ii < removeCount; ii++) {
                tempServiceList.splice(Math.round(Math.random() * tempServiceList.length - 1), 1);
            }
            console.log(serviceList);

            suppliers.push(
                {
                    "name": faker.company.companyName(),
                    "Telephone": "0419996925",
                    "messages_recv": faker.random.number(100),
                    "messages_sent": faker.random.number(100),
                    "number": faker.random.number(3),
                    "service_ids": tempServiceList
                }
            )
        }


        collection.insertMany(suppliers, (err, result) => {
            if (err != null) {
                console.log("ERROR", err);
                reject(err);
            }
            console.log("Added suppliers");
            resolve({
                suppliers,
                result
            });
        });

    })
}


const insertWorkOrders = (db, count, suppliers, supplierResults) => {
    return new Promise((resolve, reject) => {
        const collection = db.collection('workorders');
        const map = supplierResults.insertedIds;

        const supplierList = [];
        for (var key in map) {
            supplierList.push(map[key]);
        }



        const workOrders = [];
        for (var supplier of supplierList) {
            const successRatio = 10 / faker.random.number(10);
            for (var i = 0; i <= count; i++) {
                workOrders.push(
                    {
                        "date_completed": Math.random(10) < (successRatio * 10) ? faker.date.past() : faker.date.future(),
                        "date_due": faker.date.past(),
                        "description": faker.name.jobDescriptor(),
                        "priority": faker.random.number(2),
                        "report_provided": faker.random.boolean(),
                        "supplierid": supplier
                    }
                )
            }
        }


        collection.insertMany(workOrders, (err, result) => {
            if (err != null) {
                console.log("ERROR", err);
                reject(err);
            }
            console.log("Added Work orders");
            resolve({
                workOrders,
                result
            });
        });

    })
}

const insertDocuments = function (db, callback) {
    insertServices(db, 20)
        .then(({ services, result }) => insertSuppliers(db, 20, services, result))
        .then(({ suppliers, result }) => insertWorkOrders(db, 20, suppliers, result))
        .then(() => {
            console.log("DONE!")
            callback();
        })

}