require('dotenv').config();
var express = require('express');
var router = express.Router();
var request = require('request');

router.get('/', function (req, res) {
    res.render('index');
});


router.get('/', function (req, res) {
  res.render('index');
});


function callShipStation(res ,cb){
    var authString = `${process.env.SSAPIKey}:${process.env.SSAPISecret}`; 
    var cipherString = Buffer.from(authString).toString('base64');
    var finalAuthString = `Basic ${cipherString}`;
    var options = {
        url: 'https://ssapi.shipstation.com/orders?createDateStart=2019-02-18%2023:59:59',
        headers: {
          Authorization: finalAuthString 
        }
      };
      function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
          var info = JSON.parse(body);
          console.log(info);
          res.render('shipments', info);
        }
      }
      request(options, callback);
}

router.get('/shipments', function (req, res) {
    callShipStation(res);
});

function callZenDesk(res){
    var authString = `${process.env.ZDUserName}:${process.env.ZDPassword}`; 
    var cipherString = Buffer.from(authString).toString('base64');
    var finalAuthString = `Basic ${cipherString}`;
    var options = {
        url: 'https://clearlyfiltered.zendesk.com/api/v2/tickets.json',
        headers: {
          Authorization: finalAuthString 
        }
      };
      function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
          var info = JSON.parse(body);
          console.log(info);
          res.render('tickets', info);
        }
      }
      request(options, callback);
}

router.get('/tickets', function (req, res) {
    callZenDesk(res);
});

module.exports = router;