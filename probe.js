var fs = require('fs');
var ping = require('ping');

const DATA_FILE = './data.json';

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
  promises.push(pingHost(i));
}
Promise.all(promises).then(() => {
  fs.writeFileSync(DATA_FILE, '[\n' + 
    hosts.map(obj => `  ${JSON.stringify(obj)}`).join(',\n') +
    '\n]\n');
});
