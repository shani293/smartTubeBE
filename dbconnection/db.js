var MongoClient = require('mongodb').MongoClient;
function connectionDatabase() {
    return new Promise((resolve, reject) => {
        let url='mongodb://zaka:zaka@cluster0-shard-00-00.yvvpi.mongodb.net:27017,cluster0-shard-00-01.yvvpi.mongodb.net:27017,cluster0-shard-00-02.yvvpi.mongodb.net:27017/smart_tube_db?ssl=true&replicaSet=atlas-kfv4na-shard-0&authSource=admin&retryWrites=true&w=majority';
        MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, async(err, client) => {
            if (err) {
                reject(err);
            } else {
                console.log('Database Connected!');
                const db = client.db('smart_tube_db');
                resolve(db);
            }
        });
    });
}
module.exports = connectionDatabase();