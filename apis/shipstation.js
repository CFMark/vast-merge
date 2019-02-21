var request = require('request');
var shipStationAPI = {
    authString: `Basic ${Buffer.from(`${process.env.SSAPIKey}:${process.env.SSAPISecret}`).toString('base64')}`,
    get: function (endpoint, params, cb) {
        var hosturl = `https://ssapi.shipstation.com/${endpoint}?`;
        var keys = Object.keys(params);
        var url = hosturl;
        for (var i = 0; i < keys.length; i++) {
            var newParam;
            if (i === 0) {
                newParam = `${keys[i]}=${params[keys[i]]}`;
            } else {
                newParam = `&${keys[i]}=${params[keys[i]]}`;
            }
            url += newParam;
        }
        console.log(url);
        var options = {
            url: url,
            headers: {
                Authorization: shipStationAPI.authString
            }
        };
        function callback(error, response, body) {
            if (!error && response.statusCode == 200) {
                var data = JSON.parse(body);
                cb(data);
            }
        }
        request(options, callback);
    },


}

module.exports = shipStationAPI;