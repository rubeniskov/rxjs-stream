const fromStream = require('./observable/fromStream'),
      duplex = require('./operators/duplex'),
      switchMapToStream = require('./operators/switchMapToStream'),
      switchMapStream = require('./operators/switchMapStream');

module.exports = (args) => fromStream(...args);
module.exports.fromStream = fromStream;
module.exports.duplex = duplex;
module.exports.switchMapToStream = switchMapToStream;
module.exports.switchMapStream = switchMapStream;
