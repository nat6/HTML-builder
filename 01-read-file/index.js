const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'text.txt');
let ReadStream = fs.createReadStream(file, 'utf8');

ReadStream.on('data', (chunk) => console.log(chunk));
