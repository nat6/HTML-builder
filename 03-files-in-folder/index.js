const fs = require('fs');
const path = require('path');
const folder = path.join(__dirname, 'secret-folder');

fs.readdir(folder, { withFileTypes: true }, (err, data) => {
  data.forEach((file) => {
    if (file.isFile()) {
      const current = file.name;
      const ext = path.extname(current).substr(1);
      const name = current
        .split('.')
        .splice(this.length - 1, 1)
        .join('');

      fs.stat(folder + '/' + current, (err, data) => {
        const size = Math.round((data.size / 1024) * 100) / 100 + 'kb';
        console.log(name + ' - ' + ext + ' - ' + size);
      });
    }
  });
});
