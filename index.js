const request         = require('request-promise')
    , moment          = require('moment')
    , delay           = require('sleep-promise')
    , puppeteer       = require('puppeteer')
    , fs              = require('fs')
    , { spawn }       = require('child_process')
    , createHash      = require('./lib/create-hash')

let proxys = []
  , checkedProxys = {}
  , timeIds = {}

const filter = (proxys, { port }) => {
  if (port !== false) {
    const _port = port.toString()
    return proxys.filter(proxy => proxy.split(':')[1] === _port)
  }
  return proxys
}

const load = async ({ port = false, debug = false } = { port: false, debug: false }) => {
  const new_proxys = []

  const date      = moment().format(`YYYY-MM`) + '-' + moment().format(`DD`)
      , prevDate  = moment().format(`YYYY-MM`) + '-' + (parseInt(moment().format(`DD`)) - 1)

  try {
    JSON.parse(await request(`https://checkerproxy.net/api/archive/${date}`)).forEach((ip) => new_proxys.push(ip.addr))
  } catch (e) {
    debug && console.log('checkerproxy load error')
  }

  try {
    (await request(`https://top-proxies.ru/free_proxy/fre_proxy_api.php`)).match(/.+/gi).forEach((ip) => new_proxys.push(ip))
  } catch (e) {
    debug && console.log('top-proxies load error')
  }

  try {
    (await request(`https://free-proxy-list.net`)).match(/\d+\.\d+\.\d+\.\d+:\d+/gi).forEach((ip) => new_proxys.push(ip))
  } catch (e) {
    debug && console.log('free-proxy-list load error')
  }

  try {
    JSON.parse((await request(`https://www.proxy-list.download/api/v0/get?l=en&t=http`)).match(/"LISTA": .+/gi)[0].replace(/("LISTA": |}]$)/gi, '')).forEach(({ IP, PORT }) => new_proxys.push(IP + ':' + PORT))
  } catch (e) {
    debug && console.log('proxy-list load error')
  }

  try {
    JSON.parse(await request(`https://checkerproxy.net/api/archive/${prevDate}`)).forEach(ip => new_proxys.push(ip.addr))
  } catch (e) {
    debug && console.log('checkerproxy load error')
  }

  try {
    const links = JSON.parse(await request(`https://api.openproxy.space/list?skip=0&ts=${new Date() - 1}`)).filter(({ title }) => title === 'FRESH HTTP/S').map(({ code }) => code)

    for (let l = 0; l < links.length; l++) {
      try {
        const ips = (await request(`https://openproxy.space/list/${links[l]}`)).match(/\d+\.\d+\.\d+\.\d+:\d+/gi)

        ips.forEach((ip) => new_proxys.push(ip))
      } catch (e) {
        debug && console.log('openproxy load error')
      }
    }
  } catch (e) {
    debug && console.log('openproxy load error')
  }

  let _proxys = {}

  new_proxys.forEach(item => _proxys[item] = true)

  _proxys = Object.keys(_proxys)

  if (_proxys.length > 0) {
    if (port !== false) {
      const _port = port.toString()
      proxys = _proxys.filter(proxy => proxy.split(':')[1] === _port)
    } else {
      proxys = _proxys
    }
  }

  return proxys.length
}

const loadInterval = async (
  callback = () => {},
  ms = 5000,
  option = {
    started: false,
    port: false,
    debug: false
  }
) => {
  const instance = async () => {
    try {
      await load({
        port: option.port,
        debug: option.debug
      })
    } catch (e) {}

    callback(proxys.length)
  }

  option.started && instance()
  const timeId = setInterval(instance, ms)
  return () => clearInterval(timeId)
}

const checkerInterval = async (
  key = null,
  {
    url = null,
    isBrowser = false,
    trashIgnore = false,
    debugBrowser = false,
    timeout = 10000,
    stream = 2,
    debug = false,
    indicators = [],
    session = false
  } = {
    url: null,
    isBrowser: false,
    trashIgnore: false,
    debugBrowser: false,
    timeout: 10000,
    stream: 2,
    debug: false,
    indicators: [],
    session: false
  }
) => {
  const _key               = key === null ? createHash() : key
      , _url               = url === null ? 'https://yandex.ru' : url
      , _isBrowser         = typeof(isBrowser) === 'boolean' ? isBrowser : false
      , _trashIgnore       = typeof(trashIgnore) === 'boolean' ? trashIgnore : false
      , _debugBrowser      = typeof(debugBrowser) === 'boolean' ? debugBrowser : false
      , _timeout           = typeof(timeout) === 'number' ? timeout : 10000
      , _stream            = typeof(stream) === 'number' ? stream : 2
      , _debug             = typeof(debug) === 'boolean' ? debug : false
      , _indicators        = indicators instanceof Array ? indicators : []
      , _session           = session
                                ? (() => {
                                    try {
                                      return JSON.parse(fs.readFileSync(session, { encoding: 'utf8' }))
                                    } catch (e) {
                                      return []
                                    }
                                  })()
                                : false

  checkedProxys[_key] = _session === false ? [] : [..._session]

  const _timeIds = await Promise.all(
    Array(_stream).fill(1).map(async (_, index) => {
      const timeId = createHash()
      timeIds[timeId] = true

      const instance = async (id, i_id) => {
        if (timeIds[timeId] === false) {
          _debug && console.log('Stream: ' + id + ' [' + i_id + '] [Kill instance]')
          return
        }

        const proxy = (() => {
          let _proxy = random()

          while (checkedProxys[_key].find(proxy => _proxy === proxy)) {
            _proxy = random()
          }

          return _proxy
        })()

        if (_isBrowser) {
          try {
            const browser = await puppeteer.launch({
              headless: !_debugBrowser,
              ignoreHTTPSErrors: true,
              args: [`--proxy-server=${proxy}`],
            })

            setTimeout(() => {
              try {
                browser.close()
              } catch (e) {}
            }, timeout)

            try {
              const page = await browser.newPage()

              if (_trashIgnore) {
                await page.setRequestInterception(true)
                page.on('request', request => {
                    if (['media', 'xhr', 'fetch', 'websocket', 'manifest', 'image', 'stylesheet', 'font', 'script'].indexOf(request.resourceType()) !== -1) {
                        request.abort()
                    } else {
                        request.continue()
                    }
                })
              }

              await page.goto(_url)

              if (!!await _indicators.find(async ({ selector }) => {
                try {
                  return await page.$(selector)
                } catch (e) {
                  return null
                }
              })) {
                _debug && console.log('Stream: ' + id + ' [' + i_id + '] [Load & parse] valid proxy: ' + proxy)
                checkedProxys[_key].push(proxy)
                if (_session !== false) {
                  _session.push(proxy)
                }
                instance(id, i_id + 1)
                browser.close()
                return
              }

              _debug && console.log('Stream: ' + id + ' [' + i_id + '] [Load] valid proxy: ' + proxy)
            } catch (e) {
              _debug && console.log('Stream: ' + id + ' [' + i_id +  '] [Not load] invalid proxy: ' + proxy)
            }

            browser.close()
          } catch (e) {
            _debug && console.log('Stream: ' + id + ' [' + i_id + '] [Browser error] invalid proxy: ' + proxy)
          }

          instance(id, i_id + 1)
        } else {
          try {
            const result = await new Promise(res => {
              const _request = spawn('node', [__dirname + '/lib/request.js', _url, 'http://' + proxy, _timeout, JSON.stringify(_indicators.map(({ keyword }) => keyword))])
              _request.stdout.on('data', data => res(`${data}`.trim()))
            })

            if (result === 'timeout') {
              throw new Error()
            }

            if (result === 'true') {
              _debug && console.log('Stream: ' + id + ' [' + i_id + '] [Load & parse] valid proxy: ' + proxy)
              checkedProxys[_key].push(proxy)
              if (_session !== false) {
                _session.push(proxy)
              }
              return instance(id, i_id + 1)
            }

            _debug && console.log('Stream: ' + id + ' [' + i_id + '] [Load] valid proxy: ' + proxy)
          } catch (e) {
            _debug && console.log('Stream: ' + id + ' [' + i_id + '] [Not load] invalid proxy: ' + proxy)
          }

          instance(id, i_id + 1)
        }
      }

      for (;;) {
        if (proxys.length > 0) {
          setTimeout(instance, index * 2000, index, 0)
          break
        }
        await delay(500)
      }

      return timeId
    })
  )

  return {
    key: _key,
    kill: () => {
      _timeIds.forEach(timeId => (timeIds[timeId] = false))
      fs.writeFileSync(session, JSON.stringify(_session))
    },
    save: () => fs.writeFileSync(session, JSON.stringify(_session))
  }
}

const all = ({ port = false } = { port: false }) => {
  const array = filter(proxys, { port })
  return array.length > 0 ? array : false
}

const random = ({ port = false } = { port: false }) => {
  const array = all({ port })
  return array.length > 0 ? array[parseInt(Math.random() * (array.length - 1))] : false
}

const get = (key = null) => ({
  all: ({ port = false } = { port: false }) => {
    if (key === null) {
      throw new Error('not key name')
    }
    const array = filter(checkedProxys[key], { port })
    return array.length > 0 ? array : false
  },
  random: ({ port = false } = { port: false }) => {
    if (key === null) {
      throw new Error('not key name')
    }
    const array = filter(checkedProxys[key], { port })
    return array.length > 0 ? array[parseInt(Math.random() * (array.length - 1))] : false
  }
})

module.exports = {
  load,
  loadInterval,
  checkerInterval,
  all,
  random,
  get
}
