#!/usr/bin/env node

/* XXX eslint-disable no-unused-vars */
/* XXX eslint-disable prefer-const */

const path = require('path')
const fs = require('fs')
const endOfLine = require('os').EOL
const consola = require('consola')
const lib = require('../lib/includes')

const lang = process.argv[2] || ''

let config = {
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
  const nuxtConfig = lib.importFile('nuxt.config.js')
  config = lib.getConfig(nuxtConfig, config)
  if (!(config instanceof Object)) {
    process.exit(1)
  }
  await lib.checkFiles(config)
  const phrases = lib.getSentences(config.directories, config.fileMask)
  for (const locale of config.locales) {
    // consola.warn(process.pid)
    let translationCode = locale.code
    if (typeof locale.translationCode === 'string') {
      translationCode = locale.translationCode
    }
    if (lang.length > 0 && lang !== translationCode) {
      consola.info(`Translation from \x1B[36m${config.sourceLanguage}\x1B[0m to \x1B[36m${translationCode}\x1B[0m will not be executed because the command line was specified filter \x1B[36m${lang}\x1B[0m`)
      continue
    }
    // const langFile = path.join(process.cwd(), config.langDir, locale.file)
    const langFile = path.join(config.langDir, locale.file)

    const opts = {}
    let translations = {}
    translations = lib.importFile(langFile) || {}
    if (phrases.length === 0) {
      consola.warn(lib.phrasesWarn + lib.URL)
      return
    }
    const exist = Object.keys(translations)
    const unused = exist.filter(x => !phrases.includes(x))
    const diffs = phrases.filter(x => !exist.includes(x))
    if (diffs.length === 0) {
      consola.info(`\x1B[36m${langFile}\x1B[0m up to date`)
      continue
    }

    const lines = []
    for (const key of diffs) {
      const res = await lib.translate(config.sourceLanguage, translationCode, key)
      translations[key] = res.translated
      if (res.opts.length) {
        opts[key] = res.opts
      }
    }
    Object.keys(translations).forEach((k, i) => {
      let line = '  '
      line += k.match(/^[a-zA-Z_][a-zA-Z_\d]+$/) ? k : `'${k}'`
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
}
)()
