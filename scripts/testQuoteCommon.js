'use strict'

var prefixes = {
  'red.ilpdemo.org': 'us.usd.red.',
  'blue.ilpdemo.org': 'us.usd.blue.',
  'michiel-eur.herokuapp.com': 'lu.eur.michiel-eur.',
  'ilp-kit.michielbdejong.com': 'lu.eur.michiel.',
  'cornelius.sharafian.com': 'us.usd.cornelius.',
  'hive.dennisappelt.com': 'lu.eur.hive.',
  'cygnus.vahehovhannisyan.com': 'us.usd.cygnus.',
  'john.jpvbs.com': 'us.usd.jonhvb.',
  'nexus.justmoon.com': 'us.usd.nexus.',
  'michiel-is-not-available.herokuapp.com': 'us.usd.michiel-is-not-available.',
  'ggizi.herokuapp.com': 'us.usd.ggizi.',
};

const ILP = require('ilp')
const FiveBellsLedgerPlugin = require('ilp-plugin-bells')
const passwords = require('../passwords')

module.exports.test = function(from, conn, to) {
  console.log('test', { from, conn, to })
  const startTime = new Date().getTime();
  const sender = ILP.createSender({
    _plugin: FiveBellsLedgerPlugin,
    prefix: prefixes[from],
    account: `https://${from}/ledger/accounts/connectorland`,
    password: passwords[from],
    connectors: [ prefixes[from] + conn ],
  })
  
  const receiver = ILP.createReceiver({
    _plugin: FiveBellsLedgerPlugin,
    prefix: prefixes[to],
    account: `https://${to}/ledger/accounts/connectorland`,
    password: passwords[to],
  })
  
  return  receiver.listen().then(() => {
    return receiver.createRequest({ amount: 0.01 });
  }).then(request => { 
console.log(request);
    return sender.quoteRequest(request);
  }).then(params => {
    console.log({ from, conn, to }, params);
    return params.sourceAmount;
  }).catch(err => {
    console.error({ from, conn, to }, err);
    return 'error';
  });
    // return { error: err, duration: new Date().getTime()-startTime };
};
