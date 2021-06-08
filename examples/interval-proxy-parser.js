const proxy = require('./../index.js')

/* Parser with automatic loading of new proxy servers */

;(async () => {
  const kill = await proxy.loadInterval(count => {
    console.log(`count parse: ${count}`)
  }, 60000, { started: true, debug: false, port: 8080 }) // object optional

  console.log(proxy.all({ port: 8888 })) //  object optional
  console.log(proxy.random({ port: 80 })) //  object optional

  /* kill interval parsing */
  // kill()

  setInterval(() => {
    if (proxy.all().length > 1488) {
      console.log(proxy.all())
      kill()
    }
  }, 5000)
})()
