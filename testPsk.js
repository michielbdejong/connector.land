'use strict'

const co = require('co')
const ILP = require('ilp')
const FiveBellsLedgerPlugin = require('ilp-plugin-bells')
const passwords = require('./passwords')
const fs = require('fs')

module.exports.test = function(from, to, amount) {
  console.log('test', { from, to, amount })
  const startTime = new Date().getTime();
  const sender = ILP.createSender({
    _plugin: FiveBellsLedgerPlugin,
    account: `https://${from}/ledger/accounts/connectorland`,
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

function runTest(from, to) {
  promises.push(module.exports.test(from, to, 0.01).then(result => {
    console.log('DONE!', result);
    if (typeof results[from] === 'undefined') {
      results[from] = {};
    }
    if (typeof results[from][to] === 'undefined') {
      results[from][to] = {};
    }
    results[from][to] = result;
  }));
}

var promises = [];
var results = {};
for (var from in passwords) {
  for (var to in passwords) {
    runTest(from, to);
  }
}
Promise.all(promises).then(() => {
  console.log(results);
  fs.writeFileSync('performance.json', JSON.stringify(results));
  // have to work out why this is necessary:
  process.exit(0)
});
