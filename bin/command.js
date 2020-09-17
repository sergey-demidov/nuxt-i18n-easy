#!/usr/bin/env node

/* XXX eslint-disable no-unused-vars */
/* XXX eslint-disable prefer-const */

// const path = require('path')
// const fs = require('fs')
// const endOfLine = require('os').EOL
const consola = require('consola')
const lib = require('../lib/includes')

let config = {
  directories: [
    './layouts',
    './pages',
    './components'
  ],
  fileMask: ['*.vue', '*.js'],
  sourceLanguage: 'en',
  locales: [],
  langDir: '',
  lang: process.argv[2] || ''
};

(async () => {
  const nuxtConfig = lib.importFile('nuxt.config.js')
  if (!nuxtConfig) {
    consola.error(`Cant import file\x1B[36m nuxt.config.js\x1B[0m.\n${lib.URL}`)
    return
  }
  config = lib.getConfig(nuxtConfig, config)
  if (typeof config !== 'object') { return }
  if (!(await lib.checkFiles(config))) { return }
  const phrases = lib.getSentences(config.directories, config.fileMask)
  if (phrases.length === 0) {
    consola.warn(`${lib.phrasesWarn}\n${lib.URL}`)
    return
  }
  for (const locale of config.locales) {
    if (config.lang.length && config.lang !== locale.translationCode) {
      consola.info(`Translation from \x1B[36m${config.sourceLanguage}\x1B[0m to \x1B[36m${locale.translationCode}\x1B[0m will not be executed because the command line was specified filter \x1B[36m${config.lang}\x1B[0m`)
      continue
    }
    const result = await lib.processSentences(phrases, config.sourceLanguage, locale)
    if (result) { lib.writeConfig(locale, result) }
  }
}
)()
