const duplex = require('../operators/duplex'),
      {pipe} = require('rxjs/internal/util/pipe.js');

module.exports = (...args) => pipe(...args.map(o => o.write && o.pipe ? duplex(o) : o));
