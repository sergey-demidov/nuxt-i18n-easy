const path = require('path')
const fs = require('fs')
const querystring = require('querystring')
const endOfLine = require('os').EOL
const minimatch = require('minimatch')
const consola = require('consola')
const axios = require('axios')
const inquirer = require('inquirer')
const esmImport = require('esm')(module)
// const _ = require('lodash')

const lib = {}

lib.checkFiles = async (config) => {
  if (!fs.existsSync(config.langDir)) {
    consola.log(`\u{1F527} Directory ${config.langDir} does not exist `)
    await inquirer.prompt([
      {
        name: 'dir',
        type: 'confirm',
        message: 'Do you wish to create it?'
      }, {
        when (yes) {
          if (yes) {
            const res = fs.mkdirSync(path.join(process.cwd(), config.langDir))
            console.dir(res)
          } else {
            process.exit()
          }
        }
      }])
    if (!fs.existsSync(config.langDir)) {
      consola.error(lib.directoryWarn(config.langDir))
      process.exit(1)
    }
  }
  console.log('End of dir prompt')
  for (const locale of config.locales) {
    const langFile = path.join(config.langDir, locale.file)
    if (!fs.existsSync(langFile)) {
      consola.log(`\u{1F527} File ${langFile} does not exist `)
      await inquirer.prompt([
        {
          name: 'file',
          type: 'confirm',
          message: 'Do you wish to create it?'
        }, {
          when (yes) {
            if (yes) {
              const res = fs.writeFileSync(path.join(process.cwd(), langFile), '')
              console.dir(res)
            } else {
              process.exit(1)
            }
          }
        }])
      if (!fs.existsSync(langFile)) {
        consola.error(`File ${langFile} does not exist`)
        consola.info(`Tip: You may need to run\n\n
                \x1B[36m touch ${langFile} \x1B[0m\n\n`)
        process.exit(1)
      }
    }
    console.log('End of file prompt')
  }
}

lib.getConfig = (nuxtConfig, config) => {
  let i18n = {}
  if (nuxtConfig.i18n instanceof Object) {
    i18n = nuxtConfig.i18n
  } else if (Array.isArray(nuxtConfig.modules)) {
    for (const module of nuxtConfig.modules) {
      if (module.includes('nuxt-i18n')) {
        i18n = module[1]
      }
    }
  } else {
    consola.error(`No \x1B[36mi18n\x1B[0m config detected.\n${lib.example}\n${lib.URL}`)
    return
  }
  // if (_.isEmpty(i18n)) {
  //   consola.error(`No \x1B[36mi18n\x1B[0m config detected.\n${lib.example}\n${lib.URL}`)
  //   return
  // }
  if (Array.isArray(i18n.locales) && i18n.locales.length > 0) {
    config.locales = i18n.locales.slice()
  }
  if (typeof i18n.langDir === 'string') {
    config.langDir = i18n.langDir
  } else {
    consola.error(`Property \x1B[36mi18n.langDir\x1B[0m is not defined\n${lib.example}\n${lib.URL}`)
    return
  }
  if (config.locales.length === 0) {
    consola.error(`No \x1B[36mi18n\x1B[0m locales detected.\nYou must specify one or more locales.\n${lib.example}\n${lib.URL}`)
    return
  }
  if (nuxtConfig.i18nEasy instanceof Object) {
    if (Array.isArray(nuxtConfig.i18nEasy.directories) && nuxtConfig.i18nEasy.directories.length > 0) {
      config.directories = nuxtConfig.i18nEasy.directories
    }
    if (Array.isArray(nuxtConfig.i18nEasy.files) && nuxtConfig.i18nEasy.files.length > 0) {
      config.fileMask = nuxtConfig.i18nEasy.files
    }
    if (typeof nuxtConfig.i18nEasy.sourceLanguage === 'string') {
      config.sourceLanguage = nuxtConfig.i18nEasy.sourceLanguage
    }
  }
  for (const locale of config.locales) {
    if (!locale.code) {
      consola.error(`Property \x1B[36mcode\x1B[0m for i18n locale not defined.\n${lib.example}\n${lib.URL} `)
      return
    }
    if (!locale.file) {
      consola.error(`Property \x1B[36mfile\x1B[0m for locale \x1B[36m${locale.code}\x1B[0m not defined.\n${lib.example}\n${lib.URL} `)
      return
    }
  }
  return config
}

lib.importFile = (fileName) => {
  try {
    const entry = esmImport(path.join(process.cwd(), fileName)).default
    // console.dir(entry)
    return entry
  } catch (e) {
    // consola.error(`No \x1B[36mnuxt.config.js\x1B[0m file detected. \n We are definitely in the \x1B[36mNUXT\x1B[0m project directory?\n${lib.URL}`)
    consola.error(e)
    return null
  }
}

lib.translate = async (from, to, sentence) => {
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
    q: sentence.trim()
  })
  const res = await axios.get('http://translate.googleapis.com/translate_a/single?' + requestString, {
    headers: { Accept: '*/*' }
  })
  // if (process.env.DEBUG === 'true') { console.dir(res.data, { depth: 10 }) }
  // console.dir(res.data, { depth: 10 })
  let translated = ''
  if (res.data[0] && res.data[0][0]) {
    for (const ph of res.data[0]) {
      if (ph[0] === null) { break } else { translated += ph[0] }
    }
  }
  if (res.data[1] && res.data[1][0]) {
    opts = res.data[1][0][1] || []
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
    // if (process.env.DEBUG === 'true') { console.dir(res.data, { depth: 10 }) }
    return { translated: sentence, opts }
  }
}

lib.getSentences = (dirs, fileMask) => {
  const phrases = []
  for (const dir of dirs) {
    if (fs.existsSync(dir)) {
      const files = lib.getFiles(dir, fileMask)
      for (const file of files) {
        const lines = fs.readFileSync(file, 'utf-8').split(endOfLine)        const regexp = [
          /"([^"]+)"\.tr\(\)/g, /'([^']+)'\.tr\(\)/g,
          /\$t\('([^']+)'\)/g, /\$t\("([^"]+)"\)/g,
          /v-tr[^>]*>\s*([^<]+[^ ])\s*</g]
        for (const reg of regexp) {
          const matches = lines.matchAll(reg)
          for (const match of matches) {
            const sanitized = match[1].replace(/&#(\d+);/g, (match, dec) => {
              return String.fromCharCode(dec)
            })
            phrases.push(sanitized)
          }
        }
      }
    } else {
      consola.warn(`Cant open directory \x1B[36m${dir}\x1B[0m, possible typo in \x1B[36m\x1B[4mnuxt.nuxtConfig.js\x1B[0m\x1B[0m`)
    }
  }
  return phrases
}

lib.URL = '\nPlease refer documentation on https://github.com/sergey-demidov/nuxt-i18n-easy'

lib.phrasesWarn = `No words or phrases found for translation
Try to add to your project something like this:

     \x1B[36m $t('Welcome') \x1B[0m
            or
     \x1B[36m 'Inspire'.tr()\x1B[0m
            or
\x1B[36m <p v-tr> I will be translated </p> \x1B[0m

`
lib.example = `\nExample \x1B[4mnuxt.nuxt.js\x1B[0m :\n
\x1B[90mexport default {\x1B[36m
  modules:
    'nuxt-i18n',
    'nuxt-i18n-easy'
  ],
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

`

lib.getFiles = (root, masks) => {
  if (!Array.isArray(masks)) {
    if (typeof masks === 'string') {
      masks = [masks]
    } else { return [] }
  }
  let res = []
  const files = fs.readdirSync(root)
  files.forEach((file) => {
    const filename = path.join(root, file)
    const stat = fs.lstatSync(filename)
    if (stat.isDirectory()) {
      res = res.concat(lib.getFiles(filename, masks)) // recursive
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

lib.directoryWarn = (langDir) => {
  return `Directory \x1B[36m${langDir}\x1B[0m dos not exist.
You need to create this directory

\x1B[36m            mkdir ${langDir} \x1B[0m

or specify it correctly in \x1B[4m\x1B[4mnuxt.nuxtConfig.js\x1B[0m\x1B[0m\n${lib.URL}`
}

module.exports = lib
