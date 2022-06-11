const fs = require('fs');
const path = require('path')

module.exports = () => new Promise(resolve => {

  fs.readdir('./python/prefabs', (err, files) => {

    if (err)
      throw err;

    for (const file of files)
      fs.unlinkSync(path.join('./python/prefabs', file), err => {
        if (err)
          throw err;
      });

    resolve(true)

  });

})