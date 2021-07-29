const proxy = require('./../index.js')

/* Automatic proxy parser and puppeteer checker,viewer body */

;(async () => {
  await proxy.loadInterval(count => {
    console.log(`count parse: ${count}`)
  }, 60000, { started: true, debug: false })

  const keyName = 'chaturbate' // Name for accumulation

  const { key, kill, save, clean } = await proxy.checkerInterval(keyName, {
    url: 'https://chaturbate.com/diana_smiley/',
    isBrowser: true, // Checking site access via puppeteer
    timeout: 60000,
    stream: 10, // The number of browsers running at the same time
    session: __dirname + '/chaturbate.json', // Saving the current session after kill or save with subsequent loading
    debug: true, // Information about requests
    indicators: [{
      //keyword: 'close_entrance_terms', // Works only for pure request
      selector: '#close_entrance_terms' // Works only for puppeteer request
    }], // List other indicators in the object,
    onData: body => {
      const proxys = proxy.get(key).all()
      console.clear()
      console.log(proxys, proxys.length)
      console.log(body.slice(0, 100)+'...')

      if (proxys.length > 20) {
        kill()
      }
    }
  })
})()
