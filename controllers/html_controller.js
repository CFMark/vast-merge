var express = require('express');
var router = express.Router();
var request = require('request');

router.get('/', function (req, res) {
    res.render('index');
});

router.get('/shipments', function (req, res) {
    var options = {
        url: 'https://api.github.com/repos/request/request',
        headers: {
          'User-Agent': 'request'
        }
      };
    res.render('shipments');
});

router.get('/tickets', function (req, res) {
    res.render('tickets');
});

module.exports = router;