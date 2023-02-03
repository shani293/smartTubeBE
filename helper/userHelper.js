
const conn = require('../dbconnection/db');
const ObjectId = require('mongodb').ObjectId;

module.exports = {

  registerUser: (user) => {
    return new Promise(async (resolve, reject) => {
      let dbo = await conn;
      dbo.collection("users").find({ email: user.email }).toArray(async function (err, res) {
        if (res.length > 0) {
          resolve(res[0])
        }
        else {
          dbo.collection("users").insertOne(user, function (err, resp) {
            if (err) {
              resolve("Something went wrong")
            }
            else {
              dbo.collection("users").findOne({ _id: new ObjectId(resp.insertedId) }, async function (err1, result) {
                if (err1) {
                  resolve("Something went wrong")
                }
                else {
                  resolve(result)
                }
              })
            }
          })
        }
      });
    })
  },

}