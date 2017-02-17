var fs = require('fs');
var ping = require('ping');
var https = require('https');
var WebFinger = require('webfinger.js').WebFinger;
var wf = new WebFinger();

var hosts = require('./data/hosts.js').hosts;
const OUTPUT_FILE = './stats.json';

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

function getApiVersion(i) {
  return new Promise((resolve) => {
    wf.lookup('https://'+hosts[i].hostname, function(err, result) {
      if (err) {
        resolve(`<span style="color:red">WebFinger error</span>`);
        return;
      }
      var version
      try {
        version = result.object.properties['https://interledger.org/rel/protocolVersion'];
      } catch(e) {
        resolve(`<span style="color:red">WebFinger properties missing</span>`);
        return;
      }
      if (typeof version === 'string') {
        resolve(`<span style="color:green">${version}</span>`);
      } else {
        resolve(JSON.stringify(version));
      }
    });
  }).then(text => {
    hosts[i].version = text;
  });
}

function checkSettlements(i) {
  return checkApiCall(i, 'settlements', '/api/settlement_methods', function(body) {
    var methods
    try {
      methods = JSON.parse(body);
      if (methods.length === 0) {
        return 'None';
      }
      return '<span style="color:green">' +
        methods.map(obj => obj.name).join(', ') +
        '</span>';
    } catch(e) {
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
var promises = [];
//for (var i=16; i<17; i++) {
for (var i=0; i<hosts.length; i++) {
  promises.push(getApiVersion(i));
  promises.push(pingHost(i));
  promises.push(checkHealth(i));
  promises.push(checkSettlements(i));
}
Promise.all(promises).then(() => {
  fs.writeFileSync(OUTPUT_FILE, '[\n' +
    hosts.sort(function(a, b) {
console.log(a.settlements, b.settlements)
    if ((('' + a.version).indexOf('<span style="color:green">') !== -1) && (('' + b.version).indexOf('<span style="color:green">') === -1)) { return -1; }
    if ((('' + a.version).indexOf('<span style="color:green">') === -1) && (('' + b.version).indexOf('<span style="color:green">') !== -1)) { return 1; }
    if ((('' + a.settlements).indexOf('<span style="color:red">') !== -1) && (('' + b.settlements).indexOf('<span style="color:red">') === -1)) { return 1; }
    if ((('' + a.settlements).indexOf('<span style="color:red">') === -1) && (('' + b.settlements).indexOf('<span style="color:red">') !== -1)) { return -1; }
    if ((a.health === 'OK') && (b.health !== 'OK')) { return -1; }
    if ((a.health !== 'OK') && (b.health === 'OK')) { return 1; }
    if ((a.ping) && (!b.ping)) { return -1; }
    if ((!a.ping) && (b.ping)) { return 1; }
    if ((a.settlements === 'None') && (b.settlements !== 'None')) { return 1; }
    if ((a.settlements !== 'None') && (b.settlements === 'None')) { return -1; }
    if (a.hostname < b.hostname) { return -1; }
    if (a.hostname > b.hostname) { return 1; }
    return 0;
  }).map(line =>
    `<tr><td><a href="https://${line.hostname}">${line.hostname}</a></td>` +
        `<td>${line.version}</td>` +
        `<td>${line.prefix}</td>` +
        `<td>${line.owner}</td>` +
        `<td>${line.settlements.slice(0, 50)}</td>` +
        `<td>${line.health.slice(0, 50)}</td>` +
        (line.ping?`<td style="color:green">&#x2713;</td>` : `<td style="color:red">&#x2716;</td>`) +
        `</tr>`
  ).map(str => `  ${JSON.stringify(str)}`).join(',\n') +
    '\n]\n');
});
