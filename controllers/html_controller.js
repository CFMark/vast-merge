require('dotenv').config();
var express = require('express');
var router = express.Router();
var request = require('request');

router.get('/', function (req, res) {
    res.render('index');
});

function testCall(res ,cb){
    var authString = `${process.env.SSAPIKey}:${process.env.SSAPISecret}`; 
    var cipherString = Buffer.from(authString).toString('base64');
    var authString = `Basic ${cipherString}`;
    var options = {
        url: 'https://ssapi.shipstation.com/orders?createDateStart=2019-02-17%2023:59:59',
        headers: {
          Authorization: authString 
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

    testCall(res);
    
    
});

router.get('/tickets', function (req, res) {
    res.render('tickets');
});

module.exports = router;