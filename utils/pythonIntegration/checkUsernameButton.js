const { PythonShell } = require('python-shell');
const clearPrefabs = require('./clearPrefabs');

module.exports = (page) => new Promise(async resolve => {

  let mainResult = '';

  while (1 == 1) {

    await clearPrefabs()

    await page.screenshot({ path: './python/prefabs/screenshot.png' })

    mainResult = await (new Promise(resolve => {
      PythonShell.run('match_username_confirm_button.py', {
        mode: 'text',
        scriptPath: './python'
      }, function (err, result) {

        if (err)
          throw err;

        resolve(result.toString());

      });
    }))

    console.log('username button: ', mainResult)

    if (mainResult != 'NO')
      break;

    await (new Promise(r => setTimeout(r, 500)))

  }

  resolve(mainResult != 'NO' ? { x: parseInt(mainResult.split(':')[0]), y: parseInt(mainResult.split(':')[1]) } : mainResult)

})