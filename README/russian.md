![logo](https://github.com/prohetamine/proxy-checker/blob/main/media/logo.png)

##### README доступен на языках: [Русский](https://github.com/prohetamine/proxy-checker/blob/main/README/russian.md) | [Английский](https://github.com/prohetamine/proxy-checker/blob/main/README.md)


# proxy-checker

> proxy-checker - Максимально универсальный прокси-парсер и прокси-чекер.

### Почему ?
Мне, а значит и многим необходимо [получать](#load) прокси для обхода бана по IP при большом количестве запросов. Этот модуль позволяет выполнять практически все задачи связанные с подготовкой прокси. Мне, а значит многим требуется собирать прокси индивидуально для некоторых сайтов, я также позаботился об [этом](#checkerInterval). Надеюсь мой вклад облегчит кому-то [жизнь](https://www.patreon.com/prohetamine).

### С чего начать

Установим npm модуль  ```@prohetamine/proxy-checker```

```sh
$ npm install @prohetamine/proxy-checker
```

или

```sh
$ yarn add @prohetamine/proxy-checker
```

### Примеры и описание

Подключение модуля

```sh
const proxy = require('@prohetamine/proxy-checker')
```

#### <a name="load">load</a>

Функция [load](#load) собирает прокси и легко их отдает через [all](#all) и [random](#random).

##### object

| ключ | значение | значение по-умолчанию | обязательный | информация |
| ------ | ------ | ------ | ------ | ------ |
| port | number | false | нет | используется для фильтра портов |
| debug | boolean | false | нет | используется для отладки |

```sh
const proxy = require('@prohetamine/proxy-checker')

;(async () => {
  const count = await proxy.load({
    port: 8888,
    debug: true
  })

  console.log(count) // Количество собранных прокси с портом 8888
})()
```

#### <a name="loadInterval">loadInterval</a>

Функция [loadInterval](#loadInterval) собирает прокси с интервалом в _N миллисекунд_ и легко их отдает через [all](#all) и [random](#random).

| параметры | значение по-умолчанию | информация |
| ------ | ------ | ------ |
| function | () => {} | функция обратного вызова возвращающая в единственном аргументе количество загруженных IP |
| int | 5000 | интервал в миллисекундах |
| object | { started, port, debug } | дополнительные опции |

##### object

| ключ | значение | значение по-умолчанию | обязательный | информация |
| ------ | ------ | ------ | ------ | ------ |
| started | boolean | false | нет | используется для мгновенной загрузки |
| port | boolean | false | нет | используется для фильтра портов |
| debug | boolean | false | нет | используется для отладки |

```sh
const proxy = require('@prohetamine/proxy-checker')

;(async () => {
  const kill = await proxy.loadInterval(count => {
    console.log(`count parse: ${count}`) // Количество собранных прокси с портом 8080
  }, 60000, { started: true, debug: false, port: 8080 })

  console.log(proxy.all({ port: 8888 })) // Все загруженные IP адреса с портом 8888
  console.log(proxy.random({ port: 80 })) // Один случайный IP адрес с портом 80

  setInterval(() => {
    if (proxy.all().length > 1488) {
      console.log(proxy.all())
      kill() // убивает текущий loadInterval
    }
  }, 5000)
})()
```

#### <a name="all">all</a>

Функция [all](#all) возвращает массив IP адресов когда он загружен [load](#load) или [loadInterval](#loadInterval) и false когда загрузка еще не произошла.

##### object

| ключ | значение | значение по-умолчанию | обязательный | информация |
| ------ | ------ | ------ | ------ | ------ |
| port | number | false | нет | используется для фильтра портов |

```sh
const proxy = require('@prohetamine/proxy-checker')

;(async () => {
  const count = await proxy.load({
    debug: true
  })

  console.log(proxy.all({ port: 1488 })) // Все загруженные IP адреса с портом 1488
})()
```

#### <a name="random">random</a>

Функция [random](#random) возвращает один случайный IP адрес когда он загружен [load](#load) или [loadInterval](#loadInterval) и false когда загрузка еще не произошла.

##### object

| ключ | значение | значение по-умолчанию | обязательный | информация |
| ------ | ------ | ------ | ------ | ------ |
| port | number | false | нет | используется для фильтра портов |

```sh
const proxy = require('@prohetamine/proxy-checker')

;(async () => {
  const count = await proxy.load({
    debug: true
  })

  console.log(proxy.random({ port: 8888 })) // Один случайный IP адрес с портом 8888
})()
```

#### <a name="checkerInterval">checkerInterval</a>

Функция [checkerInterval](#checkerInterval) чекает прокси с интервалом в _N миллисекунд_ для определенного сайта и легко их отдает через [get.all](#getall) и [get.random](#getrandom).

| параметры | значение по-умолчанию | информация |
| ------ | ------ | ------ |
| string | null | уникальный идентификатор |
| object | { url, isBrowser, browserConfig, timeout, stream, debug, indicators, session, onData } | дополнительные опции |

##### object

| ключ | значение | значение по-умолчанию | обязательный | информация |
| ------ | ------ | ------ | ------ | ------ |
| url | string | null | нет | ссылка на сайт |
| isBrowser | boolean | false | нет | используется для проверки через браузер |
| trashIgnore | boolean | false | нет | используется для оптимизации, убирает загрузку media, xhr, fetch, websocket, manifest, image, stylesheet, font, script |
| browserConfig | object | { ... } | нет | используется для настройки лаунчера |
| onData | function | () => { ... } | нет | используется для получения тела успешного запроса (рабоатает только для browser) |
| timeout | int | 10000 | нет | интервал в миллисекундах |
| stream | int | 2 | нет | количество одновременных потоков |
| debug | boolean | false | нет | используется для отладки |
| indicators | array | [] | нет | индикаторы правильно загруженных данных |
| session | string | false | нет | путь для сохранения валидных IP после завершения или сохранения |
| quarantineMode | boolean | false | нет | используется для переведения не рабочих прокси в карантин |

##### array[object]

| ключ | значение | значение по-умолчанию | обязательный | информация |
| ------ | ------ | ------ | ------ | ------ |
| keyword | string | нет | да | используется для поиска на странице по ключевому слову |
| selector | string | нет | да | используется для поиска на странице по дом ноде |

```sh
const proxy = require('@prohetamine/proxy-checker')

;(async () => {
  await proxy.loadInterval(count => {
    console.log(`count parse: ${count}`) // Количество собранных прокси
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
    }] // Перечислите другие показатели в объектах если они требуются
  })

  setInterval(() => {
    const proxys = proxy.get(key).all()
    console.clear()
    console.log(proxys, proxys.length)

    if (proxys.length > 20) {
      kill() // убивает текущий checkerInterval и сохраняет сессию
      save() // только сохраняет сессию
    }
  }, 3000)
})()
```

```
const proxy = require('@prohetamine/proxy-checker')

;(async () => {
  await proxy.loadInterval(count => {
    console.log(`count parse: ${count}`) // Количество собранных прокси с портом
  }, 60000, { started: true, debug: false })

  const keyName = null // Уникальный идентификатор для аккумуляции IP, если установлено значение null, будет сгенерировано автоматически

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
    }] // Перечислите другие показатели в объектах если они требуются
  })

  setInterval(() => {
    const proxys = proxy.get(key).all()
    console.clear()
    console.log(proxys, proxys.length)

    if (proxys.length > 20) {
      kill() // убивает текущий checkerInterval и сохраняет сессию
      save() // только сохраняет сессию
    }
  }, 3000)
})()
```

#### <a name="getall">get.all</a>

Функция [get.all](#getall) возвращает массив прочеканых [checkerInterval](#checkerInterval) IP адресов по уникальному идентификатору и false когда загрузка еще не произошла.

##### get(key)

| параметры | значение по-умолчанию | обязательный | информация |
| ------ | ------ | ------ | ------ |
| string | null | да |уникальный идентификатор |

##### object

| ключ | значение | значение по-умолчанию | обязательный | информация |
| ------ | ------ | ------ | ------ | ------ |
| port | number | false | нет | используется для фильтра портов |

```sh
const proxy = require('@prohetamine/proxy-checker')

;(async () => {
  await proxy.loadInterval(count => {
    console.log(`count parse: ${count}`) // Количество собранных прокси
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
    }] // Перечислите другие показатели в объектах если они требуются
  })

  setInterval(() => {
    const proxys = proxy.get(key).all()
    console.clear()
    console.log(proxys, proxys.length)

    if (proxys.length > 20) {
      kill() // убивает текущий checkerInterval и сохраняет сессию
      save() // только сохраняет сессию
    }
  }, 3000)
})()
```

#### <a name="getrandom">get.random</a>

Функция [get.random](#getrandom) возвращает один случайный из прочеканых [checkerInterval](#checkerInterval) IP адресов по уникальному идентификатору и false когда загрузка еще не произошла.

##### get(key)

| параметры | значение по-умолчанию | обязательный | информация |
| ------ | ------ | ------ | ------ |
| string | null | да |уникальный идентификатор |

##### object

| ключ | значение | значение по-умолчанию | обязательный | информация |
| ------ | ------ | ------ | ------ | ------ |
| port | number | false | нет | используется для фильтра портов |

```sh
const proxy = require('@prohetamine/proxy-checker')

;(async () => {
  await proxy.loadInterval(count => {
    console.log(`count parse: ${count}`) // Количество собранных прокси
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
    }] // Перечислите другие показатели в объектах если они требуются
  })

  setInterval(() => {
    console.log(proxy.get(key).random())
  }, 3000)
})()
```

Другие примеры из этого проекта можно найти тут: [examples](https://github.com/prohetamine/proxy-checker/blob/main/examples)

### Контакты

Мой Телеграм: [@prohetamine](https://t.me/prohetamine), [канал](https://t.me/prohetamines)

Почта: prohetamine@gmail.com

Донат денег: [patreon](https://www.patreon.com/prohetamine)

Если у вас есть какие-либо вопросы и/или предложения, пожалуйста, напишите мне в телеграмме, если вы найдете ошибки также дайте мне знать, я буду очень благодарен.
