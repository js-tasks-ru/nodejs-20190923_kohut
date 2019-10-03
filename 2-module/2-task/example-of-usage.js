const LineSplitStream = require('./LineSplitStream');
const os = require('os');

let counter = 0;
const lines = new LineSplitStream({
  encoding: 'utf-8',
});

function onData(line) {
  console.log(' --- ', counter++, line);
}

lines.on('data', onData);

lines.write(`первая строка${os.EOL}вторая строка${os.EOL}третья строка`);

lines.write('a');
lines.write(`b${os.EOL}c`);
lines.write(`d${os.EOL}e`);
lines.write('f');

lines.end();
