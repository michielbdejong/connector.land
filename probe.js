var fs = require('fs');
var ping = require('ping');
var https = require('https');

const DATA_FILE = './data.json';

function checkUrl(i, path) {
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

function checkApiCall(i, field, path, print) {
  return checkUrl(i, path).then((result) => {
    if (result.error) {
        return `<span style="color:red">${result.error}</span>`;
    } else if (result.status === 200) {
      return print(result.body);
    } else {
      return `HTTP <span style="color:red">${result.status}</span> response`;
    }
  }).then(text => {
    hosts[i][field] = text;
  });
}

function checkHealth(i) {
  return checkApiCall(i, 'health', '/api/health', function(body) {
    return body;
  });
}

function checkSettlements(i) {
  return checkApiCall(i, 'settlements', '/api/settlement_methods', function(body) {
    var methods
    console.log('parsing', hosts[i].hostname, body);
    try {
      methods = JSON.parse(body);
      if (methods.length === 0) {
        return 'None';
      }
      return '<span style="color:green">' +
        methods.map(obj => obj.name).join(', ') +
        '</span>';
    } catch(e) {
      console.log(body, e);
      return '<span style="color:red">Unparseable JSON</span>';
    }
  });
}

function pingHost(i) {
  return new Promise((resolve) => {
    ping.sys.probe(hosts[i].hostname, function(isAlive){
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
//for (var i=6; i<9; i++) {
for (var i=0; i<hosts.length; i++) {
  console.log('checking', hosts[i].hostname);
  promises.push(pingHost(i));
  promises.push(checkHealth(i));
  promises.push(checkSettlements(i));
}
Promise.all(promises).then(() => {
  fs.writeFileSync(DATA_FILE, '[\n' + 
    hosts.map(obj => `  ${JSON.stringify(obj)}`).join(',\n') +
    '\n]\n');
});
