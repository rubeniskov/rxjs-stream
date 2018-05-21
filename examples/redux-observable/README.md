# RxJS Stream with Redux Observable

This example show ho to use [RxJS Stream](https://github.com/rubeniskov/rxjs-stream)

```javascript
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
