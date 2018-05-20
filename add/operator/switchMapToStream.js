const { Observable } = require('rxjs'),
      switchMapToStream = require('../../operators/switchMapToStream');

Observable.prototype.switchMapToStream = function(fn) {
    return switchMapToStream(stream)(this);
};
