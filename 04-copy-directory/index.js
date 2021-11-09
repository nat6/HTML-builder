const fs = require('fs');
const path = require('path');
const { mkdir, rm } = require('fs/promises');

const input = path.join(__dirname, 'files');
const output = path.join(__dirname, 'files-copy');

async function removeDir(name) {
  await rm(name, { force: true, recursive: true });
}

async function copyFiles(inputPath, outputPath) {
  await mkdir(outputPath, { recursive: true });

  fs.readdir(inputPath, { withFileTypes: true }, (err, data) => {
    data.forEach((file) => {
      const current = file.name;
      const inputCurrent = path.resolve(inputPath, current);
      const outputCurrent = path.resolve(outputPath, current);

      if (file.isFile()) {
        fs.copyFile(inputCurrent, outputCurrent, () => {});
      } else {
        console.log('Wow! I found a folder');
        copyFiles(inputCurrent, outputCurrent);
      }
    });
  });
}

async function copyDir() {
  await removeDir(output);
  await copyFiles(input, output);
}

copyDir();
