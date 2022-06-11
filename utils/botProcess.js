const puppeteer = require('puppeteer');
const processStartsJson = require('./processStartsJson');
const checkCloseButton = require('./pythonIntegration/checkCloseButton');
const checkPlayButton = require('./pythonIntegration/checkPlayButton');
const pickEgg = require('./pythonIntegration/pickEgg');

let forProcess = [];
let inProcess = false;

const processGame = (profile) => new Promise(async resolve => {

  let browser = await puppeteer.launch({
    userDataDir: `profiles/${profile}`,
    headless: false,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--mute-audio',
      '--disable-web-security',
      `--load-extension=${process.env.META_MASK_PATH}`,
    ],
    ignoreDefaultArgs: ["--disable-extensions"],
  });

  let [page] = await browser.pages();

  await page.on('dialog', async dialog => {
    await dialog.accept();
  });
  await page.on('error', async function (err) {
    const errorMessage = err.toString();
    console.log('browser error: ', errorMessage);
  });
  await page.on('pageerror', async function (err) {
    const errorMessage = err.toString();
    console.log('browser page error: ', errorMessage);
  });

  await browser.on('targetcreated', async (target) => {

    if (target.type() == 'page') {

      let metamaskPage = await target.page();

      let isStarted = false;

      setTimeout(async () => {
        if (!isStarted)
          await metamaskPage.reload()
      }, 1000 * 20)

      if (target.url().indexOf('nkbihfbeogaeaoehlefnkodbefgpgknn') != -1) {

        await metamaskPage.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.85 YaBrowser/21.11.0.1996 Yowser/2.5 Safari/537.36');

        await metamaskPage.setViewport({ width: 1600, height: 850, deviceScaleFactor: 1 });

        await metamaskPage.reload()

        await metamaskPage.waitForSelector('#password', { visible: true, timeout: 0 })

        isStarted = true;

        await metamaskPage.click('#password')

        await metamaskPage.waitForTimeout(2000)

        await metamaskPage.type('#password', '123QWEasdZXC', { delay: 100 })

        await metamaskPage.waitForTimeout(2000)

        await metamaskPage.waitForSelector('#app-content > div > div.main-container-wrapper > div > div > button', { visible: true, timeout: 0 })

        await metamaskPage.click('#app-content > div > div.main-container-wrapper > div > div > button')

        isStarted = false;

        setTimeout(async () => {
          if (!isStarted)
            await metamaskPage.reload()
        }, 1000 * 30)

        await metamaskPage.goto('https://play.kawaii.global/')

        await checkPlayButton(metamaskPage)

        isStarted = true;

        await metamaskPage.mouse.click(770, 580, { button: 'left', delay: 200 })

        await checkCloseButton(metamaskPage)

        await metamaskPage.mouse.click(1275, 100, { button: 'left', delay: 200 })

        await pickEgg(metamaskPage)

        processStartsJson('write', profile, new Date(new Date().setHours(new Date().getHours() + 10)))

        browser.close()

        resolve(true)

      }

    }

  })

})

module.exports = async () => {

  let allStarts = processStartsJson('read');

  forProcess = allStarts.filter(v => allStarts.filter(v => new Date().getTime() >= new Date(v.date).getTime() ? v : null))

  setInterval(async () => {

    if (!inProcess && forProcess.length > 0) {

      inProcess = true;

      await processGame(forProcess[0].profile)

      forProcess.shift()
      inProcess = false;

    }

  }, 1000)

  setInterval(() => {

    let allStarts = processStartsJson('read');

    forProcess = [...forProcess, ...allStarts.filter(v => new Date().getTime() >= new Date(v.date).getTime() ? v : null)]

  }, 1000)

}