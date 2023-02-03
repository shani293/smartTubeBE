var MongoClient = require('mongodb').MongoClient;
function connectionDatabase() {
    return new Promise((resolve, reject) => {
        let url='mongodb://adminUser:adminPasswordDB%40Hiller@cluster0-shard-00-00.f2mbb.mongodb.net:27017,cluster0-shard-00-01.f2mbb.mongodb.net:27017,cluster0-shard-00-02.f2mbb.mongodb.net:27017/fit-struction?ssl=true&replicaSet=atlas-i82532-shard-0&authSource=admin&retryWrites=true&w=majority';
        MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, async(err, client) => {
            if (err) {
                reject(err);
            } else {
                console.log('Database Connected!');
                const db = client.db('smart-tube');
                resolve(db);
            }
        });
    });
}
module.exports = connectionDatabase();