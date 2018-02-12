const puppeteer = require('puppeteer')

// Description:
//   Show the cheapest flight to a city from Santiago, Chile using despegar.com
//
// Dependencies:
//   Pupepeteer
//
// Configuration:
//   None
//
// Commands:
//   hubot vuelo barato a valdivia - Returns the cheapest price to Valdivia from Santiago
//
// Author:
//   @raerpo_

// I want to keep the city list small. If you want to include more cities you can do it here:
const cityCodes = {
  // Chile
  osorno: 'ZOS',
  concepcion: 'CCP',
  iquique: 'IQQ',
  antofagasta: 'ANF',
  arica: 'ARI',
  coquimbo: 'COW',
  castro: 'WCA',
  temuco: 'ZCO',
  'isla de pascua': 'IPC',
  valdivia: 'ZAL',
  'punta arenas': 'PUQ',
  'puerto aisen': 'WPA',
  balmaceda: 'BBA',
  'puerto montt': 'PMC',
  // Colombia
  bogota: 'BOG',
  medellin: 'EOH',
  'san andres': 'ADZ',
  // Argentina
  'buenos aires': 'BUE',
  mendoza: 'MDZ',
  // USA
  'new york': 'NYC',
  // Europa
  madrid: 'mad',
  roma: 'rom',
  paris: 'par'
}

module.exports = robot => {
  robot.respond(/vuelo barato a (.*)/i, msg => {
    const city = msg.match[1].toLowerCase()
    const cityExist = typeof cityCodes[city] !== 'undefined'
    if (!cityExist) return msg.send('No conozco esa ciudad :retard:')
    const cityCode = cityCodes[city]
    msg.send(`Buscando el vuelo más barato para ${city} :airplane_departure: :loading:`)
    ;(async () => {
      const browser = await puppeteer.launch()
      const page = await browser.newPage()
      page.setViewport({ width: 1280, height: 1000 })
      await page.goto(`https://www.despegar.cl/vuelos/scl/${cityCode}/`, { waitUntil: 'networkidle2' })
      const price = await page.evaluate(() => document.querySelector('#alerts .price-amount').textContent)
      if (!price) {
        msg.send(`No encontré ningún vuelo para ${city} :sadhuemul:`)
      }
      msg.send(`Encontré vuelos desde: CLP ${price}`)
      msg.send(`Se puede comprar aquí: https://www.despegar.cl/vuelos/scl/${cityCode}/`)
      await browser.close()
    })()
  })
}
