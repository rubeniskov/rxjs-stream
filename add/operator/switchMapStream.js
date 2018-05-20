const { Observable } = require('rxjs'),
      switchMapStream = require('../../operators/switchMapStream');

Observable.prototype.switchMapStream = function(fn) {
    return switchMapStream(fn)(this);
};
