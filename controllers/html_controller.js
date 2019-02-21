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
  //var date = req.params.date;
  var today = new Date().toISOString().split("T")[0];
  var reqParams = {
    'shipDateStart': `${today}%2000:00:00`,
    'includeShipmentItems': true,
  }

  shipStationAPI.get('shipments',reqParams, function(data){
    var shipments ={shipments: []};
    for(var i=0; i<data.shipments.length; i++){
      var shipment = data.shipments[i];
      if( shipment.advancedOptions.storeId !== 172911 && shipment.warehouseId === 227247 && shipment.isReturnLabel === false){
        shipments.shipments.push(data.shipments[i]);
      }
    }
    //console.log(shipments);
    res.render('shipments', shipments);
  });
});

router.get('/tickets', function (req, res) {
    //callZenDesk(res);
    zendeskAPI.tickets.get(res);
});

module.exports = router;