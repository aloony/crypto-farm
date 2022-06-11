const puppeteer = require('puppeteer');
const fs = require('fs');

const createWallet = (profile) => new Promise(async resolve => {

  let browser = await puppeteer.launch({
    userDataDir: `profiles/${profile}`,
    headless: false,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--mute-audio',
      '--disable-web-security',
      `--load-extension=${process.env.META_MASK_PATH}`
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

        await metamaskPage.reload()

        await metamaskPage.waitForSelector('#app-content > div > div.main-container-wrapper > div > div > div > button', { visible: true, timeout: 0 })

        isStarted = true;

        await metamaskPage.click('#app-content > div > div.main-container-wrapper > div > div > div > button')

        await metamaskPage.waitForTimeout(2000)

        await metamaskPage.waitForSelector('#app-content > div > div.main-container-wrapper > div > div > div.select-action__wrapper > div > div.select-action__select-buttons > div:nth-child(2) > button', { visible: true, timeout: 0 })

        await metamaskPage.click('#app-content > div > div.main-container-wrapper > div > div > div.select-action__wrapper > div > div.select-action__select-buttons > div:nth-child(2) > button')

        await metamaskPage.waitForTimeout(2000)

        await metamaskPage.waitForSelector('#app-content > div > div.main-container-wrapper > div > div > div > div.metametrics-opt-in__footer > div.page-container__footer > footer > button.button.btn--rounded.btn-primary.page-container__footer-button', { visible: true, timeout: 0 })

        await metamaskPage.click('#app-content > div > div.main-container-wrapper > div > div > div > div.metametrics-opt-in__footer > div.page-container__footer > footer > button.button.btn--rounded.btn-primary.page-container__footer-button')

        await metamaskPage.waitForTimeout(2000)

        await metamaskPage.waitForSelector('#create-password', { visible: true, timeout: 0 })

        await metamaskPage.waitForTimeout(2000)

        await metamaskPage.type('#create-password', '123QWEasdZXC')

        await metamaskPage.waitForTimeout(2000)

        await metamaskPage.type('#confirm-password', '123QWEasdZXC')

        await metamaskPage.waitForTimeout(2000)

        await metamaskPage.click('#app-content > div > div.main-container-wrapper > div > div > div:nth-child(2) > form > div.first-time-flow__checkbox-container > div')

        await metamaskPage.waitForTimeout(2000)

        await metamaskPage.click('#app-content > div > div.main-container-wrapper > div > div > div:nth-child(2) > form > button')

        await metamaskPage.waitForTimeout(2000)

        await metamaskPage.waitForSelector('#app-content > div > div.main-container-wrapper > div > div > div.seed-phrase-intro > div > div.seed-phrase-intro__left > div.box > button', { visible: true, timeout: 0 })

        await metamaskPage.click('#app-content > div > div.main-container-wrapper > div > div > div.seed-phrase-intro > div > div.seed-phrase-intro__left > div.box > button')

        await metamaskPage.waitForTimeout(2000)

        await metamaskPage.waitForSelector('#app-content > div > div.main-container-wrapper > div > div > div.reveal-seed-phrase > div.seed-phrase__sections > div.seed-phrase__main > div.reveal-seed-phrase__secret > div.reveal-seed-phrase__secret-blocker', { visible: true, timeout: 0 })

        await metamaskPage.click('#app-content > div > div.main-container-wrapper > div > div > div.reveal-seed-phrase > div.seed-phrase__sections > div.seed-phrase__main > div.reveal-seed-phrase__secret > div.reveal-seed-phrase__secret-blocker')

        await metamaskPage.waitForTimeout(2000)

        let words = await metamaskPage.$eval("#app-content > div > div.main-container-wrapper > div > div > div.reveal-seed-phrase > div.seed-phrase__sections > div.seed-phrase__main > div.reveal-seed-phrase__secret > div", el => el.innerText);

        await fs.writeFileSync(`./metamask_accounts/${profile}.txt`, words, { encoding: 'utf-8' })

        await metamaskPage.click('#app-content > div > div.main-container-wrapper > div > div > div.reveal-seed-phrase > div.reveal-seed-phrase__buttons > button.button.btn--rounded.btn-primary.first-time-flow__button')

        await metamaskPage.waitForTimeout(2000)

        await metamaskPage.evaluate((words) => {

          let allButtons = [...document.querySelector('#app-content > div > div.main-container-wrapper > div > div > div.confirm-seed-phrase > div.confirm-seed-phrase__sorted-seed-words').children];

          for (let i = 0; i < words.length; i++) {
            let findResult = allButtons.find(v => v.innerText == words[i] && !v.classList.contains('confirm-seed-phrase__seed-word--selected'))

            if (findResult.length > 1)
              findResult[0].click()
            else
              findResult.click()

          }

        }, words.split(' '))

        await metamaskPage.waitForTimeout(2000)

        await metamaskPage.click('#app-content > div > div.main-container-wrapper > div > div > div.confirm-seed-phrase > button')

        await metamaskPage.waitForTimeout(2000)

        await metamaskPage.waitForSelector('#app-content > div > div.main-container-wrapper > div > div > button', { visible: true, timeout: 0 })

        await metamaskPage.click('#app-content > div > div.main-container-wrapper > div > div > button')

        browser.close()

        resolve(words)

      }

    }

  })

  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.85 YaBrowser/21.11.0.1996 Yowser/2.5 Safari/537.36');

  await page.setViewport({ width: 1600, height: 850, deviceScaleFactor: 1 });

})

const approveWallet = (profile, words) => new Promise(async resolve => {

  let browser = await puppeteer.launch({
    userDataDir: `profiles/${profile}`,
    headless: false,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--mute-audio',
      '--disable-web-security',
      `--load-extension=${process.env.META_MASK_PATH}`
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

        await metamaskPage.waitForSelector('#password', { visible: true, timeout: 0 })

        isStarted = true;

        await metamaskPage.click('#password')

        await metamaskPage.waitForTimeout(2000)

        await metamaskPage.type('#password', '123QWEasdZXC', { delay: 100 })

        await metamaskPage.waitForTimeout(2000)

        await metamaskPage.waitForSelector('#app-content > div > div.main-container-wrapper > div > div > div > button', { visible: true, timeout: 0 })

        await metamaskPage.click('#app-content > div > div.main-container-wrapper > div > div > div > button')

        await metamaskPage.waitForTimeout(2000)

        await metamaskPage.waitForSelector('#app-content > div > div.main-container-wrapper > div > div > div.seed-phrase-intro > div > div.seed-phrase-intro__left > div.box > button', { visible: true, timeout: 0 })

        await metamaskPage.click('#app-content > div > div.main-container-wrapper > div > div > div.seed-phrase-intro > div > div.seed-phrase-intro__left > div.box > button')

        await metamaskPage.waitForTimeout(2000)

        await metamaskPage.waitForSelector('#app-content > div > div.main-container-wrapper > div > div > div.reveal-seed-phrase > div.seed-phrase__sections > div.seed-phrase__main > div.reveal-seed-phrase__secret > div.reveal-seed-phrase__secret-blocker', { visible: true, timeout: 0 })

        await metamaskPage.click('#app-content > div > div.main-container-wrapper > div > div > div.reveal-seed-phrase > div.seed-phrase__sections > div.seed-phrase__main > div.reveal-seed-phrase__secret > div.reveal-seed-phrase__secret-blocker')

        await metamaskPage.waitForTimeout(2000)

        await metamaskPage.click('#app-content > div > div.main-container-wrapper > div > div > div.reveal-seed-phrase > div.reveal-seed-phrase__buttons > button.button.btn--rounded.btn-primary.first-time-flow__button')

        await metamaskPage.waitForTimeout(2000)

        await metamaskPage.evaluate((words) => {

          let allButtons = [...document.querySelector('#app-content > div > div.main-container-wrapper > div > div > div.confirm-seed-phrase > div.confirm-seed-phrase__sorted-seed-words').children];

          for (let i = 0; i < words.length; i++) {
            let findResult = allButtons.find(v => v.innerText == words[i] && !v.classList.contains('confirm-seed-phrase__seed-word--selected'))

            if (findResult.length > 1)
              findResult[0].click()
            else
              findResult.click()

          }

        }, words.split(' '))

        await metamaskPage.waitForTimeout(2000)

        await metamaskPage.click('#app-content > div > div.main-container-wrapper > div > div > div.confirm-seed-phrase > button')

        await metamaskPage.waitForTimeout(2000)

        await metamaskPage.waitForSelector('#app-content > div > div.main-container-wrapper > div > div > button', { visible: true, timeout: 0 })

        await metamaskPage.click('#app-content > div > div.main-container-wrapper > div > div > button')

        await metamaskPage.waitForTimeout(2000)

        await metamaskPage.waitForSelector('#app-content > div > div.app-header.app-header--back-drop > div > div.app-header__account-menu-container > div.account-menu__icon', { visible: true, timeout: 0 })

        await metamaskPage.click('#app-content > div > div.app-header.app-header--back-drop > div > div.app-header__account-menu-container > div.account-menu__icon')

        await metamaskPage.waitForTimeout(2000)

        await metamaskPage.waitForSelector('#app-content > div > div.account-menu > div:nth-child(11)', { visible: true, timeout: 0 })

        await metamaskPage.click('#app-content > div > div.account-menu > div:nth-child(11)')

        await metamaskPage.waitForTimeout(2000)

        await metamaskPage.waitForSelector('#app-content > div > div.main-container-wrapper > div > div.settings-page__content > div.settings-page__content__tabs > div > button:nth-child(6)', { visible: true, timeout: 0 })

        await metamaskPage.click('#app-content > div > div.main-container-wrapper > div > div.settings-page__content > div.settings-page__content__tabs > div > button:nth-child(6)')

        await metamaskPage.waitForTimeout(2000)

        await metamaskPage.waitForSelector('#app-content > div > div.main-container-wrapper > div > div.settings-page__content > div.settings-page__content__modules > div > div.settings-page__sub-header > div > button', { visible: true, timeout: 0 })

        await metamaskPage.click('#app-content > div > div.main-container-wrapper > div > div.settings-page__content > div.settings-page__content__modules > div > div.settings-page__sub-header > div > button')

        await metamaskPage.waitForTimeout(2000)

        await metamaskPage.waitForSelector('#app-content > div > div.main-container-wrapper > div > div.settings-page__content > div.settings-page__content__modules > div > div.networks-tab__content > div > div.networks-tab__add-network-form-body > div:nth-child(1) > label > input', { visible: true, timeout: 0 })

        await metamaskPage.type('#app-content > div > div.main-container-wrapper > div > div.settings-page__content > div.settings-page__content__modules > div > div.networks-tab__content > div > div.networks-tab__add-network-form-body > div:nth-child(1) > label > input', 'Smart Chain', { delay: 100 })

        await metamaskPage.waitForTimeout(1000)

        await metamaskPage.type('#app-content > div > div.main-container-wrapper > div > div.settings-page__content > div.settings-page__content__modules > div > div.networks-tab__content > div > div.networks-tab__add-network-form-body > div:nth-child(2) > label > input', 'https://bsc-dataseed.binance.org/', { delay: 100 })

        await metamaskPage.waitForTimeout(1000)

        await metamaskPage.type('#app-content > div > div.main-container-wrapper > div > div.settings-page__content > div.settings-page__content__modules > div > div.networks-tab__content > div > div.networks-tab__add-network-form-body > div:nth-child(3) > label > input', '56', { delay: 100 })

        await metamaskPage.waitForTimeout(1000)

        await metamaskPage.type('#app-content > div > div.main-container-wrapper > div > div.settings-page__content > div.settings-page__content__modules > div > div.networks-tab__content > div > div.networks-tab__add-network-form-body > div:nth-child(4) > label > input', 'BNB', { delay: 100 })

        await metamaskPage.waitForTimeout(1000)

        await metamaskPage.type('#app-content > div > div.main-container-wrapper > div > div.settings-page__content > div.settings-page__content__modules > div > div.networks-tab__content > div > div.networks-tab__add-network-form-body > div:nth-child(5) > label > input', 'https://bscscan.com', { delay: 100 })

        await metamaskPage.waitForTimeout(1000)

        await metamaskPage.waitForSelector('#app-content > div > div.main-container-wrapper > div > div.settings-page__content > div.settings-page__content__modules > div > div.networks-tab__content > div > div.networks-tab__add-network-form-footer > button.button.btn--rounded.btn-primary', { visible: true, timeout: 0 })

        await metamaskPage.click('#app-content > div > div.main-container-wrapper > div > div.settings-page__content > div.settings-page__content__modules > div > div.networks-tab__content > div > div.networks-tab__add-network-form-footer > button.button.btn--rounded.btn-primary')

        await metamaskPage.waitForTimeout(2000)

        browser.close()

        resolve(true)

      }

    }

  })

});

module.exports = async () => {

  let startTime = new Date()

  console.log(`Start creating wallet profiles at ${startTime.getHours()}:${startTime.getMinutes()}:${startTime.getSeconds()}`)

  for (let i = 0; i < parseInt(process.env.PROFILE_COUNT); i++) {

    if (fs.existsSync(`./matamask_accounts/${process.env.PROFILE_NAME}-${i + 1}.txt`))
      console.log(`PROFILE already created: ${process.env.PROFILE_NAME}-${i + 1}`)
    else {
      let words = await createWallet(`${process.env.PROFILE_NAME}-${i + 1}`)
      await new Promise(r => setTimeout(r, 2000))
      await approveWallet(`${process.env.PROFILE_NAME}-${i + 1}`, words)
    }

  }

  let endTime = new Date()

  console.log(`Creating wallet profiles ended in ${(endTime - startTime) / 1000 / 60} minutes at ${endTime.getHours()}:${endTime.getMinutes()}:${endTime.getSeconds()}`)

}