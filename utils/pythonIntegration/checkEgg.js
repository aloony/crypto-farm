const { PythonShell } = require('python-shell');
const clearPrefabs = require('./clearPrefabs');

module.exports = (page) => new Promise(async resolve => {

  await clearPrefabs()

  await page.screenshot({ path: './python/prefabs/screenshot.png' })

  let mainResult = await (new Promise(resolve => {
    PythonShell.run('match_egg.py', {
      mode: 'text',
      scriptPath: './python'
    }, function (err, result) {

      if (err)
        throw err;

      resolve(result.toString());

    });
  }))

  console.log('egg: ', mainResult)

  resolve(mainResult != 'NO' ? { x: parseInt(mainResult.split(':')[0]), y: parseInt(mainResult.split(':')[1]) } : mainResult)

})