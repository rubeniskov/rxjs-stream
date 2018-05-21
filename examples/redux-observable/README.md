# RxJS Stream with Redux Observable

This example shows how use [RxJS Stream](https://github.com/rubeniskov/rxjs-stream) with [Redux Observable](https://github.com/redux-observable/redux-observable).


The code bellow map the action `GET_RANDOM_DATA` to obtain random values, then each data emits is mapped to `PROCESS_RANDOM_DATA`, the aim of this example is show ho to use a transform stream to parse the data with the operator duplex.

```javascript

const { duplex, switchMapStream } require('rxjs-stream');

const getRamdonData = (action$, store) => {
    return action$.pipe(
        ofType('GET_RANDOM_DATA'),
        switchMapStream(d => randomValuesReadableStream(d.count)),
        map(data => ({type: 'PROCESS_RANDOM_DATA', data}))
        startWith({type: 'PROCESS_RANDOM_DATA_START'})
    );
}

const processRamdonData = (action$, store) => {
    return action$.pipe(
        ofType('PROCESS_RANDOM_DATA'),
        duplex(prependTransformStream('PREPEND TEXT ')),
        map(data => ({type: 'PARSED_RANDOM_DATA', data})),
        startWith({type: 'PARSED_RANDOM_DATA_START'})
    );
}

```

Here is and example using `fs.createReadStream` which read from file a stream to parse with a custom transform stream

```javascript

const fs = require('fs'),
      through = require('through2'),
      { duplex, switchMapStream } require('rxjs-stream'),
      { createStore, applyMiddleware } = require('redux'),
      { combineEpics, createEpicMiddleware, ofType } = require('redux-observable');

const getRamdonData = (action$, store) => {
    return action$.pipe(
        ofType('GET_DATA_FROM_FILE'),
        switchMapStream(d => fs.createReadStream(d.filename)),
        map(data => ({type: 'PROCESS_DATA_FROM_FILE', data}))
        startWith({type: 'PROCESS_DATA_FROM_FILE_START'})
    );
}

const processRamdonData = (action$, store) => {
    return action$.pipe(
        ofType('PROCESS_DATA_FROM_FILE'),
        duplex(through((chunk, enc, done) => {
            done(null, chunk.toUpperCase())
        })),
        map(data => ({type: 'TRANSFORM_DATA_FROM_FILE', data})),
        startWith({type: 'TRANSFORM_DATA_FROM_FILE_START'})
    );
}

const store = createStore((state = '', action) => {
    switch(action.type){
        case 'TRANSFORM_DATA_FROM_FILE':
          return state + action.data.toString('utf8');
        case 'TRANSFORM_DATA_FROM_FILE_START'
          return '';
    }

}, applyMiddleware(createEpicMiddleware(combineEpics(getRamdonData, processRamdonData))))


store.dispatch({ type: 'GET_DATA_FROM_FILE', filename: './test.txt'});


```
