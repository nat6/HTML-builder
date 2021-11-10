const fs = require('fs');
const path = require('path');
const { readdir } = require('fs/promises');

const src = path.join(__dirname, 'styles');
const output = path.join(__dirname, 'project-dist', 'bundle.css');

async function filterFiles(src, ext) {
  let files = await readdir(src, { withFileTypes: true });
  const cssFiles = [];

  files.forEach((file) => {
    const current = file.name;
    const currentExt = path.extname(current).substr(1);
    if (file.isFile() && currentExt === ext) {
      cssFiles.push(current);
    }
  });

  return cssFiles;
}

async function readFiles() {
  const cssFiles = await filterFiles(src, 'css');
  let data = [];

  for (const file of cssFiles) {
    const currentPath = path.resolve(src, file);

    let ReadStream = fs.createReadStream(currentPath, 'utf8');
    for await (const chunk of ReadStream) {
      data.push(chunk);
    }
  }

  return data;
}

async function writeFiles() {
  const cssArr = await readFiles();

  let writeableStream = fs.createWriteStream(output);

  cssArr.forEach((item) => {
    writeableStream.write(`${item}\n`);
  });
  console.log('я сделяль!');
}

writeFiles();
