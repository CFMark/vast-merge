require('dotenv').config();
var express = require('express');
var router = express.Router();
var shipStationAPI = require('../apis/shipstation');
var zendeskAPI = require('../apis/zendesk');
var names = require('../logic/normalize_name');

//index end point
router.get('/', function (req, res) {
  res.render('index');
});

//shipments end point
router.get('/shipments/', function (req, res) {
  var date = req.params.date;

  //if no date has been provided-- use today's date
  if(date === undefined){
    //set variable to today's date and remove the time data
    var today = new Date().toISOString().split("T")[0];
  }

  //here we set up a query object to pass to the Shipstation API controller method we imported 
  var reqParams = {
    'shipDateStart': `${today}%2000:00:00`,
    'includeShipmentItems': true,
  }

  //here the Shipstation API controller is invoked
  shipStationAPI.get('shipments', reqParams, function (data) {
    //create a data object to store shipment information
    var shipments = {
      shipments: [],
      lineItems: [],
      counts: {},
      countsArr: []
      
    };

    //loop through the data object
    for (var i = 0; i < data.shipments.length; i++) {
      //set variable to current shipment in iteration
      var shipment = data.shipments[i];
      //filter the shipments by store and remove the returns
      if (shipment.advancedOptions.storeId !== 172911 && shipment.warehouseId === 227247 && shipment.isReturnLabel === false) {

        //push a copy of the original shipment to the shipments array on the data object for later analysis
        shipments.shipments.push(data.shipments[i]);

        //set variable for the shipments order number
        var orderNumber = shipment.orderNumber;
        //set variable for the shipments customers email
        var customerEmail = shipment.customerEmail;
        //set a variable to the recipient name
        var recipientName = shipment.shipTo.name;
        //declare two empty variables for later use
        var newlineItem, name;

        //loop through the shipment items array
        for (var j = 0; j < shipment.shipmentItems.length; j++) {
          //if the shipment item is not a subscription only item
          if(shipment.shipmentItems[j].options !== null && shipment.shipmentItems[j].options[0].name === 'charge_delay' && shipment.shipmentItems[j].unitPrice === 0){
            //log the subscription item to the console
            console.log('subscription only');
          } else {
            //if the shipment is not a subscription item 
            name = names.normalize(shipment.shipmentItems[j].name);
            //set the newlineItem to an object that contains
            newlineItem = {
              orderNumber: orderNumber,
              customerEmail: customerEmail,
              recipientName: recipientName,
              productName: name,
              productQty: shipment.shipmentItems[j].quantity
            };
            //push to the shipment lineitems array for further aggregation
            shipments.lineItems.push(newlineItem);
          }
        }
      }
    }

    for(var i = 0; i < shipments.lineItems.length; i++){
      var countKeys = Object.keys(shipments.counts);
      var shipSKUName = `${shipments.lineItems[i].productName} x ${shipments.lineItems[i].productQty}`;
      //insert logic to assess SKU name and correct it if needed
      //EXAMPLE
      //3 Pitcher Filter sold together should be counted as a 3 Pack
      var exists = countKeys.indexOf(shipSKUName);
      if(exists<0){
        shipments.counts[shipSKUName] = 1;
      } else {
        shipments.counts[shipSKUName] += 1;
      }
    }

    var countKeys = Object.keys(shipments.counts);
    for(var i = 0; i < countKeys.length; i++){
      var newCount = {
        name: countKeys[i],
        qty: shipments.counts[countKeys[i]]
      };
      shipments.countsArr.push(newCount);
    }
    shipments.date = today;

    //console.log(shipments.counts);
    //console.log(shipments.countsArr);
    //console.log(shipments.date)


    res.render('shipments', shipments);
  });
});

router.get('/tickets', function (req, res) {
  //callZenDesk(res);
  zendeskAPI.tickets.get(res);
});

module.exports = router;