#!/usr/bin/env node

/* XXX eslint-disable no-unused-vars */
/* XXX eslint-disable prefer-const */

const consola = require('consola')
const lib = require('../lib/includes')

const main = async () => {
  const nuxtConfig = await lib.loadConfig()
  if (!nuxtConfig || nuxtConfig === {}) {
    consola.error(`Cant import file\x1B[36m nuxt.config.js\x1B[0m.\n${lib.URL}`)
    return false
  }
  const config = lib.getConfig(nuxtConfig)
  if (typeof config !== 'object') { return }
  if (!(await lib.checkFiles(config))) { return }
  const phrases = lib.getSentences(config.directories, config.fileMask)
  if (phrases.length === 0) {
    consola.warn(`${lib.phrasesWarn}\n${lib.URL}`)
    return false
  }
  for (const locale of config.locales) {
    if (config.lang.length && config.lang !== locale.translationCode) {
      consola.info(`Translation from \x1B[36m${config.sourceLanguage}\x1B[0m to \x1B[36m${locale.translationCode}\x1B[0m will not be executed because the command line was specified filter \x1B[36m${config.lang}\x1B[0m`)
      continue
    }
    const result = await lib.processSentences(phrases, config.sourceLanguage, locale)
    if (result) { lib.writeConfig(locale, result) }
  }
  return true
}

main().then(() => {})

module.exports = main
