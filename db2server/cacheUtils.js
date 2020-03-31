
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

module.exports = {
    cacheSupplierData,
    getCachedSupplierData,

}