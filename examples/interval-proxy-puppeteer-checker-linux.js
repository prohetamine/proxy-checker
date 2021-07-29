const proxy = require('./../index.js')

/* Automatic proxy parser and puppeteer checker for linux */

;(async () => {
  await proxy.loadInterval(count => {
    console.log(`count parse: ${count}`)
  }, 60000, { started: true, debug: false })

  const keyName = 'chaturbate' // Name for accumulation

  const { key, kill, save } = await proxy.checkerInterval(keyName, {
    url: 'https://chaturbate.com/diana_smiley/',
    isBrowser: true, // Checking site access via puppeteer
    browserConfig: proxy => ({
      headless: true,
      ignoreHTTPSErrors: true,
      executablePath: '/usr/bin/chromium-browser', // your path
      args: [`--proxy-server=${proxy}`, '--disable-web-security', '--no-sandbox', '--disable-setuid-sandbox'],
    }),
    timeout: 60000,
    stream: 10, // The number of browsers running at the same time
    session: __dirname + '/chaturbate.json', // Saving the current session after kill or save with subsequent loading
    debug: true, // Information about requests
    indicators: [{
      //keyword: 'close_entrance_terms', // Works only for pure request
      selector: '#close_entrance_terms' // Works only for puppeteer request
    }] // List other indicators in the objects
  })

  setInterval(() => {
    const proxys = proxy.get(key).all()
    console.clear()
    console.log(proxys, proxys.length)

    if (proxys.length > 20) {
      kill()
    }
  }, 3000)
})()
