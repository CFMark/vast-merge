var request = require('request');
var zendeskAPI = {
    authString: `Basic ${Buffer.from(`${process.env.ZDUserName}:${process.env.ZDPassword}`).toString('base64')}`,
    tickets: {
        get: function (res) {
            var options = {
                url: 'https://clearlyfiltered.zendesk.com/api/v2/tickets.json',
                headers: {
                    Authorization: zendeskAPI.authString
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
    }
}

module.exports = zendeskAPI;