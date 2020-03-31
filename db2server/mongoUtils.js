
const MongoClient = require('mongodb').MongoClient;




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

    })

})


const terminateMongoConnection = (client) => {
    client.close();
}



module.exports = {
    initializeMongoConnection,
    terminateMongoConnection
}

