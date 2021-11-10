console.log(`Спасибо за ожидание. Пусть Ваш день будет приятным :)
`);

const fs = require('fs');
const path = require('path');
const { mkdir, readdir, rm } = require('fs/promises');

const htmlTemplate = path.join(__dirname, 'template.html');
const dist = path.join(__dirname, 'project-dist');
const htmlOutput = path.join(__dirname, 'project-dist', 'index.html');
const components = path.join(__dirname, 'components');

const src = path.join(__dirname, 'styles');
const outputStyles = path.join(__dirname, 'project-dist', 'style.css');

const inputAssets = path.join(__dirname, 'assets');
const outputAssets = path.join(__dirname, 'project-dist', 'assets');

// html

async function makeHtml(template) {
  console.log('Create HTML');
  let templateContent = '';

  let templateReadStream = fs.createReadStream(template, 'utf8');
  for await (const chunk of templateReadStream) {
    templateContent = chunk;
  }

  const files = await filterFiles(components, 'html');

  for (const file of files) {
    let data = '';
    const currentPath = path.resolve(components, file);

    let ReadStream = fs.createReadStream(currentPath, 'utf8');
    for await (const chunk of ReadStream) {
      data += chunk;
    }

    const current = path.parse(currentPath);
    templateContent = templateContent.replace(`{{${current.name}}}`, data);
  }

  let writeableStream = fs.createWriteStream(htmlOutput);
  writeableStream.write(templateContent);
}

// styles

async function filterFiles(src, ext) {
  let files = await readdir(src, { withFileTypes: true });
  const filesArr = [];

  files.forEach((file) => {
    const current = file.name;
    const currentExt = path.extname(current).substr(1);
    if (file.isFile() && currentExt === ext) {
      filesArr.push(current);
    }
  });

  return filesArr;
}

async function readFiles(src, ext) {
  const files = await filterFiles(src, ext);
  let data = [];

  for (const file of files) {
    const currentPath = path.resolve(src, file);

    let ReadStream = fs.createReadStream(currentPath, 'utf8');
    for await (const chunk of ReadStream) {
      data.push(chunk);
    }
  }

  return data;
}

async function writeFiles(src, ext, output) {
  const filesArr = await readFiles(src, ext);

  let writeableStream = fs.createWriteStream(output);

  filesArr.forEach((item) => {
    writeableStream.write(`${item}\n`);
  });
  console.log('Я сделяль стили :)');
}

// assets

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
        console.log('    Wow! I found a new folder...');
        copyFiles(inputCurrent, outputCurrent);
      }
    });
  });
}

async function copyAssets() {
  console.log('Start copying the assets...');
  await removeDir(outputAssets);
  await copyFiles(inputAssets, outputAssets);
}

function makeBundle() {
  writeFiles(src, 'css', outputStyles);
  copyAssets();
  makeHtml(htmlTemplate);
}

makeBundle();
