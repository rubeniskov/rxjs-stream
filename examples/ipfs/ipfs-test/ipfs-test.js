const rxjs = require('./rxjs');
require('babel-register')()
const ipfs = require('../../modules/ipfs').default,
      markdown = require('../../modules/markdown').default;

const node = ipfs();


node.on('ready', () => {
    rxjs.rxStream(node.files.catReadableStream('Qmb2Kk5hSWk2PDnH87tnSu7ytfibcWGmEPTgBsXSgsgpUt'))
    .map((d) => d)
    .pipe(markdown())
    .subscribe(d => console.log(d.toString()));
});
