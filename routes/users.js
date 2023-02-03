var express = require('express');
var router = express.Router();
const conn = require('../dbconnection/db');
const userHelper = require('../helper/userHelper');

/* GET users listing. */
router.get('/', function (req, res, next) {
  console.log(12);
  res.send('respond with a resource');
});


router.post('/registerUser', async function (req, res) {

  let response = await userHelper.registerUser(req.body)
  if (response?.email) {
    res.send({
      success: true,
      status: 201,
      data: response
    })
  }
  else {
    res.send({
      success: false,
      status: 400,
      data: null
    })
  }
});


///////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////  insert Youtube Video Api   ////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

router.post('/insertVideo', async function (req, res, next) {

  let dbo = await conn
  dbo.collection("videos").insertOne(req.body, function (err, resp) {
    if (err) {
      var finalData = { Status: '400', message: "Something wrong Please, Try Again!" }
      res.send(finalData);
    }
    else {
      var finalData = { Status: '200', message: "Video has been saved." }
      res.send(finalData);
    }
  })
});


///////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////  get Video List against user id Api   ////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

router.post('/getVideo', async function (req, res, next) {

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
  let dbo = await conn

  var searchData = { user_id: req.body.user_id };
  dbo.collection("videos").find({}).toArray(function (err, videosResult) {
    if (err) {
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

  let dbo = await conn

  var searchData = { user_id: req.body.user_id };
  dbo.collection("coins").find(searchData).toArray(function (err, coinsResult) {
    if (err) {
      var finalData = { Status: '400', video_data: coinsResult }
      res.send(finalData);

    } else {

      var finalData = { Status: '200', video_data: coinsResult }
      res.send(finalData);

    }
  });

});

router.post('/userVideosList', async function (req, res, next) {

  let dbo = await conn

  var searchData = { user_id: req.body.user_id };
  dbo.collection("videos").find(searchData).toArray(function (err, response) {
    console.log("LIST   ", response)
    if (err) {
      var finalData = { Status: '400', videosList: response }
      res.send(finalData);

    } else {

      var finalData = { Status: '200', videosList: response }
      res.send(finalData);

    }
  });

});

module.exports = router;
