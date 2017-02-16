var fs = require('fs');
var ping = require('ping');
var https = require('https');

const DATA_FILE = './data.json';

function checkUrl(i, path, field) {
  return new Promise((resolve) => {
    var request = https.request({
      hostname: hosts[i].hostname,
      port:443,
      path: path,
      method: 'GET'
    }, function(response) {
      var str = '';
      response.on('data', function (chunk) {
        str += chunk;
      });
  
      response.on('end', function () {
        if (response.statusCode === 200) {
          hosts[i][field] = str;
        } else {
          hosts[i][field] = `http ${response.statusCode} response`;
        }
        resolve();
      });
    });
    request.setTimeout(5000, function(err) {
      hosts[i][field] = 'Timed out';
      resolve();
    });
    request.on('error', function(err) {
      hosts[i][field] = 'Connection error';
      resolve();
    });
    request.end();
  });
}

function checkSettlements(i) {
  return checkUrl(i, '/api/settlement_methods', 'settlements');
}

function pingHost(i) {
  return new Promise((resolve) => {
    console.log('pinging', hosts[i].hostname);
    ping.sys.probe(hosts[i].hostname, function(isAlive){
      console.log(hosts[i].hostname, isAlive);
      hosts[i].ping = isAlive;
      resolve();
    });
  });
}

// ...
var hosts;
var hostsJson;

try {
  hostsJson = fs.readFileSync(DATA_FILE);
  hosts = JSON.parse(hostsJson);
} catch(e) {
  console.error('Could not read ./data.json', e);
  process.exit(1);
}
var promises = [];
for (var i=0; i<hosts.length; i++) {
//for (var i=0; i<3; i++) {
  promises.push(pingHost(i));
  promises.push(checkSettlements(i));
}
Promise.all(promises).then(() => {
  fs.writeFileSync(DATA_FILE, '[\n' + 
    hosts.map(obj => `  ${JSON.stringify(obj)}`).join(',\n') +
    '\n]\n');
});
