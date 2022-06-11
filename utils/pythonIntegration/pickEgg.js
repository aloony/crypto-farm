const { PythonShell } = require('python-shell');
const checkBasket = require('./checkBasket');
const checkEgg = require('./checkEgg');
const checkMapButton = require('./checkMapButton');
const checkVisitButton = require('./checkVisitButton');

module.exports = (page) => new Promise(async resolve => {

  while (1 == 1) {

    await checkMapButton(page)

    await page.mouse.click(1250, 610, { button: 'left', delay: 200 })

    await checkVisitButton(page)

    await page.mouse.click(630, 250, { button: 'left', delay: 200 })

    await checkMapButton(page)

    for (let i = 0; i < 10; i++)
      await page.mouse.wheel({ deltaY: -1000 });

    await page.mouse.move(600, 250)
    await page.mouse.down()
    await page.mouse.move(1500, 1500, { steps: 100 })
    await page.mouse.up()

    let eggCoordinates = await checkEgg(page)
    console.log('eggCoordinates: ', eggCoordinates)
    if (eggCoordinates == 'NO')
      continue

    let petCoordinates = { x: eggCoordinates.x, y: eggCoordinates.y + 70 }
    console.log('petCoordinates: ', petCoordinates)

    await page.mouse.click(petCoordinates.x, petCoordinates.y, { button: 'right', delay: 100 })
    await page.mouse.click(petCoordinates.x, petCoordinates.y, { button: 'right', delay: 100 })

    console.log('click pet')

    await page.waitForTimeout(1000)

    let basketCoordinates = await checkBasket(page)
    console.log('basketCoordinates: ', basketCoordinates)
    if (basketCoordinates == 'NO') {
      await page.mouse.click(eggCoordinates.x, eggCoordinates.y, { button: 'left' })
      continue
    }

    eggCoordinates = await checkEgg(page)
    console.log('eggCoordinates: ', eggCoordinates)
    if (eggCoordinates == 'NO')
      continue

    petCoordinates = { x: eggCoordinates.x, y: eggCoordinates.y + 70 }
    console.log('petCoordinates: ', petCoordinates)

    await page.mouse.move(basketCoordinates.x, basketCoordinates.y)
    await page.mouse.down()
    await page.mouse.move(basketCoordinates.x, basketCoordinates.y - 200, { steps: 100 })
    await page.mouse.move(petCoordinates.x, basketCoordinates.y - 200, { steps: 100 })
    await page.mouse.move(petCoordinates.x, petCoordinates.y, { steps: 100 })
    await page.mouse.up()

    break;

  }

  resolve(true)

})