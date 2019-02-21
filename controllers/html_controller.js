require('dotenv').config();
var express = require('express');
var router = express.Router();
var shipStationAPI = require('../apis/shipstation');
var zendeskAPI = require('../apis/zendesk');
var names = require('../logic/normalize_name');

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

  shipStationAPI.get('shipments', reqParams, function (data) {
    var shipments = {
      shipments: [],
      lineItems: []
    };

    for (var i = 0; i < data.shipments.length; i++) {
      var shipment = data.shipments[i];
      if (shipment.advancedOptions.storeId !== 172911 && shipment.warehouseId === 227247 && shipment.isReturnLabel === false) {
        shipments.shipments.push(data.shipments[i]);
        var orderNumber = shipment.orderNumber;
        var customerEmail = shipment.customerEmail;
        var recipientName = shipment.shipTo.name;
        var newlineItem, name;

        for (var j = 0; j < shipment.shipmentItems.length; j++) {
          if(shipment.shipmentItems[j].options !== null && shipment.shipmentItems[j].options[0].name === 'charge_delay' && shipment.shipmentItems[j].unitPrice === 0){
            console.log('subscription only');
          } else {
            name = names.normalize(shipment.shipmentItems[j].name);
            newlineItem = {
              orderNumber: orderNumber,
              customerEmail: customerEmail,
              recipientName: recipientName,
              productName: name,
              productQty: shipment.shipmentItems[j].quantity
            };
            shipments.lineItems.push(newlineItem);
          }
        }


      }
    }

    //console.log(shipments);
    //console.log(shipments.lineItems);
    res.render('shipments', shipments);
  });
});

router.get('/tickets', function (req, res) {
  //callZenDesk(res);
  zendeskAPI.tickets.get(res);
});

module.exports = router;