const fs = require('fs')
const path = require('path')
const querystring = require('querystring')
// const endOfLine = require('os').EOL
const minimatch = require('minimatch')
const consola = require('consola')
const axios = require('axios')

const inc = {}

inc.translate = async (from, to, sentence) => {
  let opts = []
  if (to === from) {
    consola.info(`Skip translation from \x1B[36m${from}\x1B[0m to \x1B[36m${to}\x1B[0m`)
    return { translated: sentence, opts }
  }
  const requestString = querystring.stringify({
    client: 'gtx',
    ie: 'UTF-8',
    oe: 'UTF-8',
    dt: ['t', 'at', 'bd'],
    // dt: ['bd', 'ex', 'ld', 'md', 'rw', 'rm', 'ss', 't', 'at', 'gt', 'qca'],
    hl: 'en',
    sl: from,
    tl: to,
    q: sentence
  })
  const res = await axios.get('http://translate.googleapis.com/translate_a/single?' + requestString, {
    headers: { Accept: '*/*' }
  })
  // if (process.env.DEBUG === 'true') { console.dir(res.data, { depth: 10 }) }
  let translated = ''
  if (res.data[0] && res.data[0][0]) {
    for (const ph of res.data[0]) {
      if (ph[0] !== null) { translated += ph[0] }
      // eslint-disable-next-line no-console
      if (process.env.DEBUG === 'true') { console.dir(ph[0], { depth: 10 }) }
    }
  }
  if (res.data[1] && res.data[1][0]) {
    opts = res.data[1][0][1] || []
    // eslint-disable-next-line no-console
    if (process.env.DEBUG === 'true') { console.dir(opts, { depth: 10 }) }
  }
  if (translated.length > 0) {
    const startSpace = sentence.match(/^(\s+)/)
    if (startSpace) {
      translated += startSpace[1]
    }
    const endSpace = sentence.match(/(\s+)$/)
    if (endSpace) {
      translated = endSpace[1] + translated
    }
    consola.success(`'${sentence}' => '${translated}'`)
    return { translated, opts }
  } else {
    consola.error('\x1B[31mTranslation error\x1B[0m')
    // eslint-disable-next-line no-console
    if (process.env.DEBUG === 'true') { console.dir(res.data, { depth: 10 }) }
    return { translated: sentence, opts }
  }
}

inc.URL = '\nPlease refer documentation on https://github.com/sergey-demidov/nuxt-i18n-easy'

inc.phrasesWarn = `No words or phrases found for translation
Try to add to your project something like this:
      $t('Welcome')
            or
      'Inspire'.tr()
            or
<p v-tr> I will be translated </p>

`
inc.example = `\nExample \x1B[4mnuxt.nuxt.js\x1B[0m :\n
\x1B[90mexport default {\x1B[36m
  i18n: {
    locales: [
      {
        code: 'en',
        name: 'English',
        file: 'en.js',
      },
      {
        code: 'ru',
        name: 'Русский',
        file: 'ru.js',
      }
    ],
    lazy: true,
    langDir: 'lang/'
  },
  i18nEasy: {
    directories: [                // default directories for search
      './layouts',
      './pages',
      './components'
    ],
    files: ['*.vue', '*.js'],     // default files
    sourceLanguage: 'en'          // default source language
  },
  \x1B[90m\n...\n
  modules: [\x1B[36m
    'nuxt-i18n',
    'nuxt-i18n-easy'\x1B[90m
  ],
  \x1B[0m`

inc.getFiles = (root, masks) => {
  let res = []
  const files = fs.readdirSync(root)
  files.forEach((file) => {
    const filename = path.join(root, file)
    const stat = fs.lstatSync(filename)
    if (stat.isDirectory()) {
      res = res.concat(inc.getFiles(filename, masks)) // recursive
    } else {
      masks.forEach((mask) => {
        if (minimatch(file, mask)) {
          res.push(filename)
        }
      })
    }
  })
  return res
}

inc.directoryWarn = (langDir) => {
  return `Directory \x1B[36m${langDir}\x1B[0m dos not exist.
You need to create this directory

\x1B[36m            mkdir ${langDir} \x1B[0m

or specify it correctly in \x1B[4m\x1B[4mnuxt.nuxtConfig.js\x1B[0m\x1B[0m\n${inc.URL}`
}

module.exports = inc
