const puppeteer = require('puppeteer');
const checkConfirmButton = require('./pythonIntegration/checkConfirmButton');
const checkConfirmCharacter = require('./pythonIntegration/checkConfirmCharacter');
const checkPlayButton = require('./pythonIntegration/checkPlayButton');
const checkUsernameButton = require('./pythonIntegration/checkUsernameButton');
const checkUsernameInput = require('./pythonIntegration/checkUsernameInput');

const waitAnySelector = (page, selectors) => new Promise(resolve => {
  for (let i = 0; i < selectors.length; i++)
    page.waitForSelector(selectors[i], { visible: true, timeout: 0 }).then(async () => {
      page.removeAllListeners()
      resolve(selectors[i])
    }).catch(() => {
      resolve(false)
    })
})

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

  let isWalletConnect = false, isWalletSign = false;

  await browser.on('targetcreated', async (target) => {

    if (target.type() == 'page') {

      let metamaskPage = await target.page();

      let isStarted = false;

      setTimeout(async () => {
        if (!isStarted)
          await metamaskPage.reload()
      }, 1000 * 20)

      if (target.url().indexOf('nkbihfbeogaeaoehlefnkodbefgpgknn/home') != -1) {

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

        await metamaskPage.waitForSelector('#connect-button', { visible: true, timeout: 0 })

        await metamaskPage.click('#connect-button', { delay: 1000 })

        await (new Promise(resolve => {
          setInterval(() => {
            if (isWalletConnect)
              resolve(true)
          }, 1000)
        }))

        await checkPlayButton(metamaskPage)

        await metamaskPage.mouse.click(770, 580, { button: 'left', delay: 200 })

        await (new Promise(resolve => {
          setInterval(() => {
            if (isWalletSign)
              resolve(true)
          }, 1000)
        }))

        await checkConfirmCharacter(metamaskPage)

        let confirmCharacterButton = await checkConfirmButton(metamaskPage)
        console.log(confirmCharacterButton)

        await metamaskPage.mouse.click(confirmCharacterButton.x, confirmCharacterButton.y, { button: 'left', delay: 500 })

        let usernameInput = await checkUsernameInput(metamaskPage)

        await metamaskPage.mouse.click(usernameInput.x, usernameInput.y, { button: 'left', delay: 500 })

        await metamaskPage.keyboard.type('Geralt');

        let usernameButton = await checkUsernameButton(metamaskPage)

        await metamaskPage.mouse.click(usernameButton.x, usernameButton.y, { button: 'left', delay: 500 })

        for (let i = 0; i < 4; i++)
          await metamaskPage.mouse.click(usernameButton.x, usernameButton.y, { button: 'left', delay: 500 })

        browser.close()

        resolve(true)

      } else if (target.url().indexOf('nkbihfbeogaeaoehlefnkodbefgpgknn/notification') != -1) {

        let selectorForClick = await waitAnySelector(metamaskPage, [
          '#app-content > div > div.main-container-wrapper > div > div.signature-request-footer > button.button.btn--rounded.btn-primary.btn--large',
          '#app-content > div > div.main-container-wrapper > div > div.permissions-connect-choose-account > div.permissions-connect-choose-account__footer-container > div.permissions-connect-choose-account__bottom-buttons > button.button.btn--rounded.btn-primary'
        ])

        if (selectorForClick == '#app-content > div > div.main-container-wrapper > div > div.signature-request-footer > button.button.btn--rounded.btn-primary.btn--large') {

          await metamaskPage.click(selectorForClick, { delay: 1000 })

          isWalletSign = true;

        } else {

          await metamaskPage.click(selectorForClick, { delay: 1000 })

          await metamaskPage.waitForSelector('#app-content > div > div.main-container-wrapper > div > div.page-container.permission-approval-container > div.permission-approval-container__footers > div.page-container__footer > footer > button.button.btn--rounded.btn-primary.page-container__footer-button', { visible: true, timeout: 0 })

          await metamaskPage.click('#app-content > div > div.main-container-wrapper > div > div.page-container.permission-approval-container > div.permission-approval-container__footers > div.page-container__footer > footer > button.button.btn--rounded.btn-primary.page-container__footer-button', { delay: 1000 })

          isWalletConnect = true;

        }

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