const proxy = require('./../index.js')

/* Automatic proxy parser and pure checker */

;(async () => {
  await proxy.loadInterval(count => {
    console.log(`count parse: ${count}`)
  }, 60000, { started: true, debug: false })

  const keyName = null // Name for accumulation, if set to null, will be generated automatically

  const { key, kill, save, clean } = await proxy.checkerInterval(keyName, {
    url: 'https://github.com/prohetamine',
    timeout: 30000,
    stream: 20, // The number of request running at the same time
    session: __dirname + '/github.json', // Saving the current session after kill or save with subsequent loading
    debug: true, // Information about requests
    indicators: [{
      keyword: 'prohetamine', // Works only for pure request
      //selector: '#close_entrance_terms' // Works only for puppeteer request
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
