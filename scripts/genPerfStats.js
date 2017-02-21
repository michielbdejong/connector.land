var fs = require('fs');
var merged = {};
fs.readdirSync('../data/performance').map(filename => {
  var data = JSON.parse(fs.readFileSync(`../data/performance/${filename}`));
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
var stats = {};
for (var server in merged) {
  var failed = 0;
  var succeeded = 0;
  var fees = 0;
  var durations = 0;
  for (var other in merged[server].outgoing) {
    for (var timestamp in merged[server].outgoing[other]) {
      if (merged[server].outgoing[other][timestamp].error) {
        failed++;
      } else {
        succeeded++;
        fees += merged[server].outgoing[other][timestamp].fee;
      }
      durations += merged[server].outgoing[other][timestamp].duration;
    }
  }
  for (var other in merged[server].incoming) {
    for (var timestamp in merged[server].incoming[other]) {
      if (merged[server].incoming[other][timestamp].error) {
        failed++;
      } else {
        succeeded++;
        fees += merged[server].incoming[other][timestamp].fee;
      }
      durations += merged[server].incoming[other][timestamp].duration;
    }
  }
  stats[server] = {
    succeeded,
    failed,
    fees,
    durations,
    price: fees / succeeded,
    speed: durations / (succeeded + failed),
    reliability: succeeded / (succeeded + failed)
  };
  fs.writeFileSync('../data/perfStats.json', JSON.stringify(stats, null, 2));
  fs.writeFileSync(`../data/graphs/${server}.json`, JSON.stringify(merged[server], null, 2));
}

