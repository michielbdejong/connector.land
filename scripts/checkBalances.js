var https = require('https');
var passwords = require('./passwords');

function checkUrl(hostname, path) {
  return new Promise((resolve) => {
    var request = https.request({
      hostname: hostname,
      port:443,
      path: path,
      method: 'GET',
      headers: {
        'Authorization': 'Basic '+(new Buffer('connectorland:'+passwords[hostname]).toString('base64'))
      }
    }, function(response) {
      var str = '';
      response.on('data', function (chunk) {
        str += chunk;
      });

      response.on('end', function () {
        resolve({ status: response.statusCode, body: str });
      });
    });
    request.setTimeout(5000, function(err) {
      resolve({ error: 'Timed out' });
    });
    request.on('error', function(err) {
      resolve({ error: 'Connection error' });
    });
    request.end();
  });
}

var config = {};

function queryBalance(host) {
  return checkUrl(host, '/ledger/accounts/connectorland').then(res => {
    var balance = 0;
    try {
      balance = JSON.parse(res.body).balance;
    } catch(e) {
      console.error(host, e);
      return;
    }
    console.log(host, balance);
  });
}

var promises = [];
for (var host in passwords) {
  promises.push(queryBalance(host));
}
Promise.all(promises);
