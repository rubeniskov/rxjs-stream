const from = require('from2'),
      through = require('through2'),
      { switchMapTo, map, startWith } = require('rxjs/operators'),
      { fromStream, duplex, switchMapStream } = require('rxjs-stream'),
      { createStore, applyMiddleware } = require('redux'),
      { combineEpics, createEpicMiddleware, ofType } = require('redux-observable');

const randomValues = (count = 10) => {
    return from((size, next) => {
        process.nextTick(()=>{
            next(
                null, count--
                ? Buffer.from((~~ (Math.random() * 0xFFFFFFF)).toString(16) + '', 'utf8')
                : null);
        });
    })
}

const prependTest = (text) => {
    return through((chunk, enc, next) => {
        next(null, Buffer.concat([
            Buffer.from(text, 'utf8'),
            chunk
        ]));
    })
}

const getRamdonData = (action$, store) => {
    return action$.pipe(
        ofType('GET_RANDOM_DATA'),
        switchMapStream(d => randomValues(d.count)),
        map(data => ({type: 'PROCESS_RANDOM_DATA', data}))
    );
}

const processRamdonData = (action$, store) => {
    return action$.pipe(
        ofType('PROCESS_RANDOM_DATA'),
        duplex(prependTest('PREPEND TEXT ')),
        map(data => ({type: 'PARSED_RANDOM_DATA', data})),
        startWith({type: 'PARSED_RANDOM_DATA_START'})
    );
}


const epics = combineEpics(getRamdonData, processRamdonData);

const middleware = createEpicMiddleware(epics);
let count = 1;
const store = createStore((state, action) => {
      switch (action.type) {
      case 'PARSED_RANDOM_DATA':
        console.log(`Iter ${count++} -> ${action.data.toString('utf8')}`)
        return Buffer.concat([state, action.data]);
      case 'PARSED_RANDOM_DATA_START':
        return Buffer.from('', 'utf8')
      default:
        return state
    }
}, applyMiddleware(middleware));

store.subscribe(() => {
    console.log('State buffer size', store.getState().length);
})
store.dispatch({type: 'GET_RANDOM_DATA', count: 5});
