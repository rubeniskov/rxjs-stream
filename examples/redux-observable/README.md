# RxJS Stream with Redux Observable

This example shows how use [RxJS Stream](https://github.com/rubeniskov/rxjs-stream) with [Redux Observable](https://github.com/redux-observable/redux-observable).


The code bellow map the action `GET_RANDOM_DATA` to obtain random values then each data emits is mapped to `PROCESS_RANDOM_DATA`, the aim of this example is show ho to use a transform stream to parse the data with the operator duplex.

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
