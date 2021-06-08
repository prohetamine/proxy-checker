const request = require('request-promise')

;(async ({ url, proxy, timeout, indicators }) => {
  setTimeout(() => {
    console.log('timeout')
    process.exit(0)
  }, timeout)

  try {
    const body = await request.defaults({ proxy }).get(url)

    console.log(!!indicators.find(({ keyword }) => body.match(keyword)))
    process.exit(0)
  } catch (e) {
    console.log('timeout')
    process.exit(0)
  }
})({
  url: process.argv[2],
  proxy: process.argv[3],
  timeout: process.argv[4],
  indicators: JSON.parse(process.argv[5])
})
