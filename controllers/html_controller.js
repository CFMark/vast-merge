require('dotenv').config();
var express = require('express');
var router = express.Router();
var request = require('request');
var shipStationAPI = require('../apis/shipstation');
var zendeskAPI = require('../apis/zendesk');

router.get('/', function (req, res) {
    res.render('index');
});

router.get('/shipments', function (req, res) {
  var today = new Date().toISOString().split("T")[0];
  var reqParams = {
    'createDateStart': `${today}%2000:00:00`,
    'warehouse': 227247,
  }

  shipStationAPI.get('shipments',reqParams, function(data){
    res.render('shipments', data);
  });
});

router.get('/tickets', function (req, res) {
    //callZenDesk(res);
    zendeskAPI.tickets.get(res);
});

module.exports = router;