require('rxjs-stream/add/util/pipe')
const {fromStream, duplex} = require('rxjs-stream'),
    from = require('from2'),
    through = require('through2');

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

randomValues()
.pipe(prependTest('Random value with Node Stream pipeline '))
.on('data', d => console.log(d.toString()))

fromStream(randomValues())
.pipe(prependTest('Random value with RxJS pipeline '))
.subscribe(d => console.log(d.toString()));
