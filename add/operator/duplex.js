const { Observable } = require('rxjs'),
      duplex = require('../../operators/duplex');

Observable.prototype.duplex = function(stream) {
    return duplex(stream)(this);
};
