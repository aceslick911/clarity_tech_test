// Purpose: Run GraphQL request from DB1 then save into DB2. Cache for 2 minutes in DB2

const {
    initializeMongoConnection,
    terminateMongoConnection
} = require('./mongoUtils')

const {
    calculateMessageRatios,
    calculateCompletionRatios,
    calculateFinalRating,
} = require("./calcEngine")

const {
    cacheSupplierData,
    getCachedSupplierData,
} = require("./cacheUtils")

const {
    fetchDB1Data,
    filterToWebRequest,
} = require("./graphQLUtils")

var express = require('express');
var cors = require('cors');
var app = express();


let db_instance = null;
let db_client = null
let lastRequest = null;
const cacheTimeSeconds = 2//60 * 5; //5 Minutes


initializeMongoConnection().then((connection) => {
    db_instance = connection.db;
    db_client = connection.client;
    console.log("DB Connection ready")
});

app.use(cors());
app.get('/', (req, res) => {

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


const server = app.listen(3002, () => {
    console.log('Listening on port %s', server.address().port)
})
