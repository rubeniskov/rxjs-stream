const { Observable } = require('rxjs'),
      pipe = require('../../util/pipe');

Observable.prototype.pipe = function(...args){
    return pipe(...args)(this)
};
