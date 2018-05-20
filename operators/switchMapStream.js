const duplex = require('./duplex'),
      { switchMap } = require('rxjs/operators');

module.exports = fn => switchMap(d => duplex(fn(d))(null));
