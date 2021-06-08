const proxy = require('./../index.js')

/* Simple proxy server parser */

;(async () => {
  const count = await proxy.load({
    port: 8888,
    debug: true
  })

  console.log(count) // count parse

  console.log(proxy.all({ port: 8888 })) //  object optional
})()
