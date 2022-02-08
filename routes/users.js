var express = require('express');
var router = express.Router();
const conn = require('../dbconnection/db')

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});


///////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////  Social Login Api   ////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////


router.post('/registerUser', async function (req, res, next) {
  let dbo = await conn
  var obj = { name: "Zaka Md", address: "Highway 37" }
  var userdata = [];

  console.log("req.headers.authorization", req.headers.authorization)

  //Check Basic Auth is Exist or Not
  if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
    return res.status(401).json({ message: 'Missing Authorization Header' });
  }

  //Split Basic Auth ' '
  const base64Credentials = req.headers.authorization.split(' ')[1];
  //Convert Basic Auth in Original
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');

  //Check basic Auth is same
  if (credentials == "zaka:123") {

    var searchData = { email: req.body.email };
    //Check user is exist already if yes send record otherwise register it
    dbo.collection("users").find(searchData).toArray(function (err, result) {
      if (err) {
        console.log("not found");
      } else {
        if (result.length > 0) {

          var finalData = { Status: '200', user_data: result }
          res.send(finalData);

        }
        else {

          dbo.collection("users").insertOne(req.body, function (err, resp) {
            if (err) {
              console.log("Insertion Fail..")
            }
            else {

              dbo.collection("users").find(searchData).toArray(function (err, resultRegister) {
                if (err) {
                  console.log("not found");
                } else {

                  var finalData = { Status: '200', user_data: resultRegister }
                  res.send(finalData);

                }
              });
            }
          })
        }
      }


    });

  } else {
    var finalData = { Status: '400', user_data: [] }
    res.send(finalData);
  }

});


///////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////  insert Youtube Video Api   ////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

router.post('/insertVideo', async function (req, res, next) {
  console.log("Working.....", req.body)

  let dbo = await conn
  dbo.collection("videos").insertOne(req.body, function (err, resp) {
    if (err) {
      var finalData = { Status: '400', message: "Something wrong Please, Try Again!" }
      res.send(finalData);
      console.log("error", err)
    }
    else {
      var finalData = { Status: '200', message: "Video has been saved." }
      res.send(finalData);
      console.log("inserted")
    }
  })
});


///////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////  get Video List against user id Api   ////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

router.post('/getVideo', async function (req, res, next) {
  console.log("Working.....", req.body)

  let dbo = await conn

  var searchData = { user_id: req.body.user_id };
  dbo.collection("videos").find(searchData).toArray(function (err, videosResult) {
    if (err) {
      console.log("not found");
      var finalData = { Status: '400', video_data: videosResult }
      res.send(finalData);

    } else {

      var finalData = { Status: '200', video_data: videosResult }
      res.send(finalData);

    }
  });

});



///////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////  get Video List against user id Api   ////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

router.post('/getAllVideo', async function (req, res, next) {
  console.log("Working.....", req.body)

  let dbo = await conn

  var searchData = { user_id: req.body.user_id };
  dbo.collection("videos").find({}).toArray(function (err, videosResult) {
    if (err) {
      console.log("not found");
      var finalData = { Status: '400', video_data: videosResult }
      res.send(finalData);

    } else {

      var finalData = { Status: '200', video_data: videosResult }
      res.send(finalData);

    }
  });

});


///////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////  update or insert user rewarder Coins  ////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

router.post('/insertRewardedCoins', async function (req, res1, next) {
  console.log("Working.....", req.body)

  let dbo = await conn
  var finalData = ''
  var searchData = { user_id: "61c385e2ef4f79b5ec43229e" };
  dbo.collection("coins").find(searchData).toArray(function (err, coinsResult) {
    if (err) {
      console.log("not found");

    } else {

      console.log("Coins", coinsResult.length)
      if (coinsResult.length <= 0) {
        let coinsInseted = req.body
        dbo.collection("coins").insertOne(coinsInseted, function (err, resp) {
          if (err) {
            console.log("error", err)
            finalData = { Status: '400', message: "There is issu in api." }
            // res.send(finalData);
          }
          else {
            console.log("Coins inserted")
            finalData = { Status: '200', message: "Coins has been saved." }
            // res.send(finalData);
          }
          res1.send(finalData);
        })
      } else {
        console.log("Not inserted bcs already exist")
        var myquery = { user_id: req.body.user_id };
        var newvalues = { $set: { coins: req.body.coins } };
        dbo.collection("coins").updateOne(myquery, newvalues, function (err, res) {
          if (err) {
            console.log("error", err)
            finalData = { Status: '400', message: "There issue in api at update portion." }
            // res.send(finalData);
          }
          else {
            console.log("\n\n ==>Coins Updates")
            finalData = { Status: '200', message: "Coins has been saved." }
           

          }
          res1.send(finalData);
        });
      }

    }

  });

});



router.post('/getCoinAgainstUser', async function (req, res, next) {
  console.log("Working inside.....", req.body)
    
  let dbo = await conn

  var searchData = { user_id : req.body.user_id };
  dbo.collection("coins").find(searchData).toArray(function (err, coinsResult) {
    if (err) {
      console.log("not found");
      var finalData = { Status: '400', video_data: coinsResult }
      res.send(finalData);

    } else {

      var finalData = { Status: '200', video_data: coinsResult }
      res.send(finalData);

    }
  });

});

module.exports = router;
