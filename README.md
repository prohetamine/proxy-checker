![logo](https://github.com/prohetamine/proxy-checker/blob/main/media/logo.png)

##### README is available in the following languages: [Russian](https://github.com/prohetamine/proxy-checker/blob/main/README/russian.md) | [English](https://github.com/prohetamine/proxy-checker/blob/main/README.md)


# Proxy Checker

> proxy-checker - The most versatile proxy parser and proxy checker.

### Why ?
I, and therefore many people, need to [get](#load) a proxy to bypass the ban on IP with a large number of requests. This module allows you to perform almost all tasks related to proxy preparation. I, and therefore many people, need to build proxies individually for some sites, I also took care of [this](#checkerInterval). I hope my contribution will make it easier for someone [life](https://www.patreon.com/prohetamine).

### Get started

Install the npm module  ```@prohetamine/proxy-checker```

```sh
$ npm install @prohetamine/proxy-checker
```

or

```sh
$ yarn add @prohetamine/proxy-checker
```

### Examples and description

Connecting the module

```sh
const proxy = require('@prohetamine/proxy-checker')
```

#### <a name="load">load</a>

The [load](#load) function collects proxies and easily returns them via [all](#all) and [random](#random).

##### object

| key | value | default value | required | information|
| ------ | ------ | ------ | ------ | ------ |
| port | number | false | none | used for the port filter |
| debug | boolean | false | none | used for debugging |

```sh
const proxy = require('@prohetamine/proxy-checker')

;(async () => {
  const count = await proxy.load({
    port: 8888,
    debug: true
  })

  console.log(count) // Number of collected proxies with port 8888
})()
```

#### <a name="loadInterval">loadInterval</a>

The [loadInterval](#loadInterval) function collects proxies with an interval of _N milliseconds_ and easily returns them via [all](#all) and [random](#random).

| options | default | info |
| ------ | ------ | ------ |
| function | () => { /* ... */} | callback function returns in a single argument the number of IP loaded |
| int | 5000 | interval in milliseconds |
| object | { started, port, debug } | additional options |

##### object

| key | value | default value | mandatory | information |
| ------ | ------ | ------ | ------ | ------ |
| started | boolean | false | no | use for instant download |
| port | boolean | false | no | used to filter ports |
| debug | boolean | false | none | used for debugging |

```sh
const proxy = require('@prohetamine/proxy-checker')

;(async () => {
  const kill = await proxy.loadInterval(count => {
    console.log(`count parse: ${count}`) // Number of collected proxies with port 8080
  }, 60000, { started: true, debug: false, port: 8080 })

  console.log(proxy.all({ port: 8888 })) // All downloaded IP addresses with port 8888
  console.log(proxy.random({ port: 80 })) // One random IP address with port 80

  setInterval(() => {
    if (proxy.all().length > 1488) {
      console.log(proxy.all())
      kill() // kills the current loadInterval
    }
  }, 5000)
})()
```

#### <a name="all">all</a>

The [all](#all) function returns an array of IP addresses when it is loaded [load](#load) or [loadInterval](#loadInterval) and false when the load has not yet occurred.

##### object

| key | value | default value | required | information|
| ------ | ------ | ------ | ------ | ------ |
| port | number | false | none | used for the port filter |

```sh
const proxy = require('@prohetamine/proxy-checker')

;(async () => {
  const count = await proxy.load({
    debug: true
  })

  console.log(proxy.all({ port: 1488 })) // All downloaded IP addresses with port 1488
})()
```

#### <a name="random">random</a>

The [random](#random) function returns a single random IP address when it is loaded [load](#load) or [loadInterval](#loadInterval) and false when the load has not yet occurred.

##### object

| key | value | default value | required | information|
| ------ | ------ | ------ | ------ | ------ |
| port | number | false | none | used for the port filter |

```sh
const proxy = require('@prohetamine/proxy-checker')

;(async () => {
  const count = await proxy.load({
    debug: true
  })

  console.log(proxy.random({ port: 8888 })) // One random IP address with port 8888
})()
```

#### <a name="checkerInterval">checkerInterval</a>

The [checkerInterval](#checkerInterval) function checks proxies with an interval of _N milliseconds_ for a specific site and easily returns them via [get.all](#getall) and [get.random](#getrandom).

| parameters | default value | information|
| ------ | ------ | ------ |
| string | null | unique identifier |
| object | { url, isBrowser, browserConfig, timeout, stream, debug, indicators, session, onData } | additional options |

##### object

| key | value | default value | mandatory | information |
| ------ | ------ | ------ | ------ | ------ |
| url | string | null | no | website link |
| isBrowser | boolean | false | none | used for checking through the browser |
| trashIgnore | boolean | false | none | used for optimization, removes loading of media, xhr, fetch, websocket, manifest, image, stylesheet, font, script |
| browserConfig | object | { ... } | none | used to configure the launcher |
| onData | function | () => { ... } | none | used to get the body of a successful request (works only for browser) |
| timeout | int | 10000 | none | interval in milliseconds |
| stream | int | 2 | none | number of concurrent threads |
| debug | boolean | false | none | used for debugging |
| indicators | array | [] | none | indicators of correctly loaded data |
| session | string | false | none | path to save valid IP addresses after completion or saving |
| quarantineMode | boolean | false | none | used to quarantine non-working proxies |

##### array[object]

| key | value | default value | required | information|
| ------ | ------ | ------ | ------ | ------ |
| keyword | string | no | yes | used to search the page by keyword |
| selector | string | no | yes | used for searching on a page by dom node |

```sh
const proxy = require('@prohetamine/proxy-checker')

;(async () => {
  await proxy.loadInterval(count => {
    console.log(`count parse: ${count}`) // Number of collected proxies
  }, 60000, { started: true, debug: false })

  const { key, kill, save, clean } = await proxy.checkerInterval('chaturbate', {
    url: 'https://chaturbate.com/diana_smiley/',
    isBrowser: true,
    trashIgnore: true,
    browserConfig: proxy => ({
      headless: true,
      ignoreHTTPSErrors: true,
      args: [`--proxy-server=${proxy}`],
    }),
    timeout: 60000,
    stream: 10,
    session: __dirname + '/chaturbate.json',
    debug: true,
    indicators: [{
      //keyword: 'close_entrance_terms',
      selector: '#close_entrance_terms'
    }] // List other metrics in the objects if they are required
  })

  setInterval(() => {
    const proxys = proxy.get(key).all()
    console.clear()
    console.log(proxys, proxys.length)

    if (proxys.length > 20) {
      kill() // Kills the current checkerInterval and saves the session
      save() // Only saves the session
    }
  }, 3000)
})()
```

```
const proxy = require('@prohetamine/proxy-checker')

;(async () => {
  await proxy.loadInterval(count => {
    console.log(`count parse: ${count}`) // The number of proxies collected with the port
  }, 60000, { started: true, debug: false })

  const keyName = null // A unique identifier for IP accumulation, if set to null, will be generated automatically.

  const { key, kill, save, clean } = await proxy.checkerInterval(keyName, {
    url: 'https://github.com/prohetamine',
    timeout: 30000,
    stream: 20,
    session: __dirname + '/github.json',
    debug: true,
    indicators: [{
      keyword: 'Prohetamine',
      //selector: '#close_entrance_terms'
    }, {
      keyword: 'Stas'
    }] // List other metrics in the objects if they are required
  })

  setInterval(() => {
    const proxys = proxy.get(key).all()
    console.clear()
    console.log(proxys, proxys.length)

    if (proxys.length > 20) {
      kill() // Kills the current checkerInterval and saves the session
      save() // Only saves the session
    }
  }, 3000)
})()
```

#### <a name="getall">get.all</a>

The [get.all](#getall) function returns an array of checked [checkerInterval](#checkerInterval) IP addresses by a unique identifier and false when the download has not yet occurred.

##### get(key)

| parameters | default value | required | information|
| ------ | ------ | ------ | ------ |
| string | null | yes | unique identifier |

##### object

| key | value | default value | required | information|
| ------ | ------ | ------ | ------ | ------ |
| port | number | false | none | used for the port filter |

```sh
const proxy = require('@prohetamine/proxy-checker')

;(async () => {
  await proxy.loadInterval(count => {
    console.log(`count parse: ${count}`) // Number of collected proxies
  }, 60000, { started: true, debug: false })

  const { key, kill, save, clean } = await proxy.checkerInterval('chaturbate', {
    url: 'https://chaturbate.com/diana_smiley/',
    isBrowser: true,
    debugBrowser: false,
    timeout: 60000,
    stream: 10,
    session: __dirname + '/chaturbate.json',
    debug: true,
    indicators: [{
      //keyword: 'close_entrance_terms',
      selector: '#close_entrance_terms'
    }] // List other metrics in the objects if they are required
  })

  setInterval(() => {
    const proxys = proxy.get(key).all()
    console.clear()
    console.log(proxys, proxys.length)

    if (proxys.length > 20) {
      kill() // Kills the current checkerInterval and saves the session
      save() // Only saves the session
    }
  }, 3000)
})()
```

#### <a name="getrandom">get.random</a>

The function [get.random](#getrandom) returns one random of the checked [checkerInterval](#checkerInterval) IP addresses by a unique identifier and false when the download has not yet occurred.

##### get(key)

| parameters | default value | required | information|
| ------ | ------ | ------ | ------ |
| string | null | yes |unique identifier |

##### object

| key | value | default value | required | information|
| ------ | ------ | ------ | ------ | ------ |
| port | number | false | none | used for the port filter |

```sh
const proxy = require('@prohetamine/proxy-checker')

;(async () => {
  await proxy.loadInterval(count => {
    console.log(`count parse: ${count}`) // Number of collected proxies
  }, 60000, { started: true, debug: false })

  const { key, kill, save, clean } = await proxy.checkerInterval('chaturbate', {
    url: 'https://chaturbate.com/diana_smiley/',
    isBrowser: true,
    debugBrowser: false,
    timeout: 60000,
    stream: 10,
    session: __dirname + '/chaturbate.json',
    debug: true,
    indicators: [{
      //keyword: 'close_entrance_terms',
      selector: '#close_entrance_terms'
    }] // List other metrics in the objects if they are required
  })

  setInterval(() => {
    console.log(proxy.get(key).random())
  }, 3000)
})()
```

Other examples from this project can be found here: [examples](https://github.com/prohetamine/proxy-checker/blob/main/examples)

### Contacts

My Telegram: [@prohetamine](https://t.me/prohetamine), [channel](https://t.me/prohetamines)

Email: prohetamine@gmail.com

Donat money: [patreon](https://www.patreon.com/prohetamine)

If you have any questions and/or suggestions, please email me in telegram, if you find any bugs also let me know, I will be very grateful.
