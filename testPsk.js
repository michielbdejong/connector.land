'use strict'

var p = [
   'michiel-eur.herokuapp.com',
  'ilp-kit.michielbdejong.com',
  'cornelius.sharafian.com',
  'hive.dennisappelt.com',
  'cygnus.vahehovhannisyan.com',
  'john.jpvbs.com',
  'nexus.justmoon.com',
  'michiel-is-not-available.herokuapp.com',
  'ggizi.herokuapp.com',
];

var psk = require('./testPskCommon');

var tasks = [];
for (var i = 0; i<p.length; i++) {
  for (var j = i+1; j<p.length; j++) {
    tasks.push([ p[i], p[j] ]);
    tasks.push([ p[j], p[i] ]);
  }
}

function doNext() {
  console.log(psk.results, tasks);
  var next = tasks.shift();
  if (typeof next === 'undefined') {
    console.log('no tasks left')
    return Promise.resolve();
  }
  console.log(next);
  return psk.runTest(next[0], next[1]).then(doNext);
}

doNext().then(() => {
  console.log('all done!');
  console.log(psk.results);
  fs.writeFileSync(`./performance/${new Date().getTime()}.json`, JSON.stringify(psk.results));
  // have to work out why this is necessary:
  process.exit(0);
});
