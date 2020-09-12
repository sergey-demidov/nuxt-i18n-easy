#!/usr/bin/env node

/* XXX eslint-disable no-unused-vars */
/* XXX eslint-disable prefer-const */

// eslint-disable-next-line no-global-assign
require = require('esm')(module)
const path = require('path')
const fs = require('fs')
const querystring = require('querystring')
const endOfLine = require('os').EOL
const consola = require('consola')
const axios = require('axios')
const _ = require('lodash')
const inc = require('../lib/includes')

const nuxtConfig = require(path.join(process.cwd(), 'nuxt.config.js')).default
const lang = process.argv[2] || ''

const config = {
  directories: [
    './layouts',
    './pages',
    './components'
  ],
  fileMask: ['*.vue', '*.js'],
  sourceLanguage: 'en',
  locales: [],
  langDir: ''
};

(async () => {
  let i18n = {}
  if (nuxtConfig.i18n instanceof Object) {
    i18n = nuxtConfig.i18n
  } else {
    for (const module of nuxtConfig.modules) {
      if (module.includes('nuxt-i18n')) {
        i18n = module[1]
      }
    }
  }
  // console.dir(i18n)
  if (_.isEmpty(i18n)) {
    consola.error(`No \x1B[36mi18n\x1B[0m config detected.\n${inc.example}\n${inc.URL}`)
    return
  }
  if (Array.isArray(i18n.locales) && i18n.locales.length > 0) {
    config.locales = i18n.locales.slice()
  }
  if (typeof i18n.langDir === 'string') {
    config.langDir = i18n.langDir
  }

  if (config.locales.length === 0) {
    consola.error(`No \x1B[36mi18n\x1B[0m locales detected.\nYou must specify one or more locales.\n${inc.example}\n${inc.URL}`)
    return
  }
  if (!config.langDir) {
    consola.error(`Property \x1B[36mi18n.langDir\x1B[0m is not defined.\n${inc.example}\n${inc.URL} `)
    return
  }
  if (!fs.existsSync(config.langDir)) {
    consola.error(inc.directoryWarn(config.langDir))
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
  const phrases = []

  for (const dir of config.directories) {
    if (fs.existsSync(dir)) {
      const files = inc.getFiles(dir, config.fileMask)
      for (const file of files) {
        const lines = fs.readFileSync(file, 'utf-8').split(endOfLine).join('')
        const regexp = [
          /"([^"]+)"\.tr\(\)/g, /'([^']+)'\.tr\(\)/g,
          /\$t\('([^']+)'\)/g, /\$t\("([^"]+)"\)/g,
          /v-tr[^>]*>\s*([^<]+[^ ])\s*</g]
        for (const reg of regexp) {
          const matches = lines.matchAll(reg)
          for (const match of matches) {
            phrases.push(match[1])
          }
        }
      }
    } else {
      consola.warn(`Cant open directory \x1B[36m${dir}\x1B[0m, possible typo in \x1B[36m\x1B[4mnuxt.nuxtConfig.js\x1B[0m\x1B[0m`)
    }
  }

  for (const locale of config.locales) {
    if (!locale.code) {
      consola.error(`Property \x1B[36mcode\x1B[0m for i18n locale not defined.\n${inc.example}\n${inc.URL} `)
      return
    }
    if (!locale.file) {
      consola.error(`Property \x1B[36mfile\x1B[0m for locale \x1B[36m${locale.code}\x1B[0m not defined.\n${inc.example}\n${inc.URL} `)
      return
    }
    let translationCode = locale.code
    if (typeof locale.translationCode === 'string') {
      translationCode = locale.translationCode
    }
    if (lang.length > 0 && lang !== translationCode) {
      consola.info(`Translation from \x1B[36m${config.sourceLanguage}\x1B[0m to \x1B[36m${translationCode}\x1B[0m will not be executed because the command line was specified filter \x1B[36m${lang}\x1B[0m`)
      continue
    }
    const langFile = path.join(process.cwd(), config.langDir, locale.file)

    try {
      const opts = {}
      let translations = {}
      if (fs.existsSync(langFile)) {
        translations = require(langFile).default || {}
        // console.dir(translations)
      } else {
        consola.error(`File ${langFile} does not exist`)
        consola.info(`Tip: You may need to run\n\n
                \x1B[36m touch ${langFile} \x1B[0m\n\n`)
        return
      }
      if (phrases.length === 0) {
        consola.warn(inc.phrasesWarn + inc.URL)
        return
      }
      const exist = Object.keys(translations)
      const unused = exist.filter(x => !phrases.includes(x))
      const diffs = phrases.filter(x => !exist.includes(x))
      if (diffs.length === 0) {
        consola.info(`\x1B[36m${langFile}\x1B[0m up to date`)
        continue
      }

      for (const key of diffs) {
        if (translationCode === config.sourceLanguage) {
          consola.info(`Skip translation from \x1B[36m${config.sourceLanguage}\x1B[0m to \x1B[36m${translationCode}\x1B[0m`)
          translations[key] = key
        } else {
          const requestString = querystring.stringify({
            client: 'gtx',
            ie: 'UTF-8',
            oe: 'UTF-8',
            dt: ['t', 'at', 'bd'],
            // dt: ['bd', 'ex', 'ld', 'md', 'rw', 'rm', 'ss', 't', 'at', 'gt', 'qca'],
            hl: 'en',
            sl: config.sourceLanguage,
            tl: translationCode,
            q: key
          })
          const res = await axios.get('http://translate.googleapis.com/translate_a/single?' + requestString, {
            headers: { Accept: '*/*' }
          })
          // console.dir(res.data, { depth: 10 })
          let translation = ''
          if (res.data[0] && res.data[0][0]) {
            translation = res.data[0][0][0] || ''
          }
          if (res.data[1] && res.data[1][0]) {
            opts[key] = res.data[1][0][1] || ''
            // console.dir(opts)
          }
          if (translation.length > 0) {
            const startSpace = key.match(/^(\s+)/)
            if (startSpace) {
              translation += startSpace[1]
            }
            const endSpace = key.match(/(\s+)$/)
            if (endSpace) {
              translation = endSpace[1] + translation
            }
            translations[key] = translation
            consola.success(`'${key}' => '${translation}'`)
          } else {
            consola.error('\x1B[31mTranslation error, dump below \x1B[0m')
            // eslint-disable-next-line no-console
            console.dir(res.data, { depth: 10 })
          }
        }
        const lines = []
        Object.keys(translations).forEach((k, i) => {
          let line = '  '
          line += k.match(/ /) ? `'${k}'` : k
          line += `: '${translations[k]}'`
          if (i !== Object.keys(translations).length - 1) {
            line += ','
          }
          if (Object.keys(opts).includes(k)) {
            line += ` // ${opts[k].join(', ')}`
          }
          if (unused.includes(k)) {
            line += ' // unused'
          }
          lines.push(line)
        })
        const out = `${endOfLine}export default {${endOfLine}` +
                        lines.join(endOfLine) + `${endOfLine}}${endOfLine}`
        if (fs.statSync(langFile).size > 0) {
          fs.copyFileSync(langFile, langFile + '.' + new Date().toISOString().slice(0, 16).replace(/[T:]/g, '-'))
        }
        fs.writeFileSync(langFile, out)
      }
    } catch (e) {
      consola.error(e)
    }
  }
}
)()
