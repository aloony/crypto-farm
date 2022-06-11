const puppeteer = require('puppeteer');
const readlineSync = require('readline-sync');

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

        await metamaskPage.goto('https://play.kawaii.global/')

        readlineSync.question('Continue?')

        browser.close()

        resolve(true)

      }

    }

  })

})

module.exports = async () => {

  let startTime = new Date()

  console.log(`Start process game at ${startTime.getHours()}:${startTime.getMinutes()}:${startTime.getSeconds()}`)

  for (let i = 0; i < parseInt(process.env.PROFILE_COUNT); i++)
    await processGame(`${process.env.PROFILE_NAME}-${i + 1}`)

  let endTime = new Date()

  console.log(`Game process ended in ${(endTime - startTime) / 1000 / 60} minutes at ${endTime.getHours()}:${endTime.getMinutes()}:${endTime.getSeconds()}`)

}