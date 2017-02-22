'use strict'

var p = [
  { host: 'michiel-eur.herokuapp.com', conn: 'connector' },
  { host: 'ilp-kit.michielbdejong.com', conn: 'connector' },
  { host: 'cornelius.sharafian.com', conn: 'sharafian' },
  { host: 'pineapplesheep.ilp.rocks', conn: 'pineapplesheep' },
  { host: 'hive.dennisappelt.com', conn: 'dennis' },
  { host: 'cygnus.vahehovhannisyan.com', conn: 'vahe' },
  { host: 'john.jpvbs.com', conn: 'connector' },
  { host: 'royalcrypto.com', conn: 'connector' },
  { host: 'nexus.justmoon.com', conn: 'stefan' },
  { host: 'michiel-is-not-available.herokuapp.com', conn: 'connector' },
  { host: 'ggizi.herokuapp.com', conn: 'connector' },
  { host: 'best-ilp.herokuapp.com', conn: 'connector' },
  { host: 'someledger.herokuapp.com', conn: 'connector' },
];

var fs = require('fs');
var quote = require('./testQuoteCommon');

var tasks = [];
var results = {};
for (var i = 0; i<p.length; i++) {
  results[p[i].host + ' micmic' ] = {}; // every host we're currently testing has a micmic connector
  results[p[i].host + ' ' + p[i].conn] = {};
  for (var j = 0; j<p.length; j++) {
    if (p[j].host !== p[i].host) {
      tasks.push([ p[i].host, p[i].conn, p[j].host ]);
      tasks.push([ p[j].host, p[j].conn, p[i].host ]);
      tasks.push([ p[i].host, 'micmic', p[j].host ]);
      tasks.push([ p[j].host, 'micmic', p[i].host ]);
    }
  }
}

function doNext() {
  console.log(results, tasks);
  var next = tasks.shift();
  if (typeof next === 'undefined') {
    console.log('no tasks left')
    return Promise.resolve();
  }
  console.log(next);
  return quote.test(next[0], next[1], next[2]).then(res => {
    console.log({ next, res });
    results[next[0] + ' ' + next[1]][next[2]] = res;
  }).then(doNext);
}

doNext().then(() => {
  console.log('all done!');
  console.log(results);
  fs.writeFileSync(`../data/graphs/quoting.json`, JSON.stringify(results));
  process.exit(0); // this is an upstream bug
});
