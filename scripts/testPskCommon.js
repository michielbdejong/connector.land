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

const co = require('co')
const ILP = require('ilp')
const FiveBellsLedgerPlugin = require('ilp-plugin-bells')
const passwords = require('../passwords')
const fs = require('fs')

module.exports.test = function(from, to, amount) {
  console.log('test', { from, to, amount })
  const startTime = new Date().getTime();
  const sender = ILP.createSender({
    _plugin: FiveBellsLedgerPlugin,
    account: `https://${from}/ledger/accounts/connectorland`,
    connectors: [ prefixes[from] + 'dennis' ],
    password: passwords[from]
  })
  
  const receiver = ILP.createReceiver({
    _plugin: FiveBellsLedgerPlugin,
    account: `https://${to}/ledger/accounts/connectorland`,
    password: passwords[to],
    // A callback can be specified to review incoming payments.
    // This is required when using PSK.
    reviewPayment: (payment, transfer) => {
    }
  })
  
  return co(function * () {
    yield receiver.listen()
    receiver.on('incoming', (transfer, fulfillment) => {
      console.log('received transfer:', transfer)
      console.log('fulfilled transfer hold with fulfillment:', fulfillment)
    })
    // The user of this module is responsible for communicating the
    // PSK parameters from the recipient to the sender
    const pskParams = receiver.generatePskParams()
  
    // Note the payment is created by the sender
    const request = sender.createRequest({
      destinationAmount: '0.01',
      destinationAccount: pskParams.destinationAccount,
      sharedSecret: pskParams.sharedSecret
    })
    console.log('request:', request)
  
    const paymentParams = yield sender.quoteRequest(request)
    console.log('paymentParams', paymentParams)
  
    const result = yield sender.payRequest(paymentParams)
    console.log('sender result:', result)
    return { fee: (parseFloat(paymentParams.sourceAmount)-amount)/amount, duration: new Date().getTime()-startTime };
  }).catch((err) => {
    console.log(err)
    return { error: err, duration: new Date().getTime()-startTime };
  })
}

module.exports.results = {};
function runTest(from, to) {
  return module.exports.test(from, to, 0.01).then(result => {
    console.log('DONE!', result);
    if (typeof module.exports.results[from] === 'undefined') {
      module.exports.results[from] = {};
    }
    if (typeof module.exports.results[from][to] === 'undefined') {
      module.exports.results[from][to] = {};
    }
    module.exports.results[from][to] = result;
  });
}
module.exports.runTest = runTest;
