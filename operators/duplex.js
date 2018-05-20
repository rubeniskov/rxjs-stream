const rxjs = require('rxjs');

module.exports = (stream, opts = { bufferKey: 'data' }) => {

    if (stream.pause)
        stream.pause();

    return source => rxjs.Observable.create(observer => {
        function onDataHandler(data) {
            observer.next(data)
        };
        function onEndHandler() {
            observer.complete()
        };
        function onErrorHandler(err) {
            observer.error(err)
        };

        stream.addListener('data', onDataHandler);
        stream.addListener('end', onEndHandler);
        stream.addListener('error', onErrorHandler);

        if (source) {
            source.subscribe({
                next: chunk => stream
                    .write(
                        !Buffer.isBuffer(chunk)
                        && stream._writableState
                        && stream._writableState.objectMode === false
                        && Buffer.isBuffer(chunk[opts.bufferKey])
                  ? chunk[opts.bufferKey]
                  : chunk
                ),
                error: err => stream.emit('error', err),
                complete: () => stream.end()
            });
        }

        if(stream.resume)
            stream.resume();

        return () => {
            stream.removeListener('data', onDataHandler);
            stream.removeListener('end', onEndHandler);
            stream.removeListener('error', onErrorHandler);

            if (stream.destroy)
                stream.destroy();
            }
        });
}
