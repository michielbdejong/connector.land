var fs = require('fs');
var merged = {};
fs.readdirSync('./performance').map(filename => {
  var data = JSON.parse(fs.readFileSync(`./performance/${filename}`));
  var time = filename.substring(0, 13);
  for (var from in data) {
    for (var to in data[from]) {
      if (typeof merged[from] === 'undefined') {
        merged[from] = { incoming: {}, outgoing: {} };
      }
      if (typeof merged[to] === 'undefined') {
        merged[to] = { incoming: {}, outgoing: {} };
      }
      if (typeof merged[from].outgoing[to] === 'undefined') {
        merged[from].outgoing[to] = {};
      }
      if (typeof merged[to].incoming[from] === 'undefined') {
        merged[to].incoming[from] = {};
      }
      merged[from].outgoing[to][time] = data[from][to];
      merged[to].incoming[from][time] = data[from][to];
    }
  }
});
for (var server in merged) {
  fs.writeFileSync(`./graphs/${server}.json`, JSON.stringify(merged[server], null, 2));
}
