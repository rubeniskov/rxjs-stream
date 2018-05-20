const duplex = require('./duplex'),
      { switchMapTo } = require('rxjs/operators');

module.exports = stream => switchMapTo(duplex(stream)(null));
