'use strict'

var quote = require('./testQuoteCommon');

console.log(process.argv);
quote.test(process.argv[2], process.argv[3], process.argv[4]).then(res => {
  console.log(res);
  process.exit(0); // this is an upstream bug
});
