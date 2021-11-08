const fs = require('fs');
const path = require('path');
const readline = require('readline');
const process = require('process');
const { stdin: input, stdout: output } = require('process');

const file = path.join(__dirname, 'text.txt');
const rl = readline.createInterface({ input, output });
let writeableStream = fs.createWriteStream(file);

const question = 'What Does The Fox Say?';
const bye = 'Wow! Battery level: low. Goodbye my friend :)';

console.log(question);

rl.on('line', (answer) => {
  if (answer === 'exit') {
    console.log(bye);
    process.exit();
  }
  writeableStream.write(`${answer} \n`);
});

process.on('beforeExit', () => console.log(bye));
