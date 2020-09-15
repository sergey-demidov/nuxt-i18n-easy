<<<<<<< HEAD
import conf from './mocks/nuxt.config.js'
const lib = require('../lib/includes')

const clone = (o) => {
  return JSON.parse(JSON.stringify(o))
}
let nuxtConfig = clone(conf)

it('parse nuxtConfig', () => {
=======
// const { setup, loadConfig, get } = require('@nuxtjs/module-test-utils')
const { loadConfig } = require('@nuxtjs/module-test-utils')
const lib = require('../lib/includes')

it('parse config', () => {
  const conf0 = loadConfig(__dirname, '../../example')
  console.dir(conf0)
  const conf = {
    i18n: {
      locales: [
        {
          code: 'en',
          name: 'English',
          file: 'en.js'
        }
      ],
      lazy: true,
      langDir: 'lang/'
    },
    i18nEasy: {
      directories: [
        './layouts',
        './pages',
        './components'
      ],
      files: ['*.vue', '*.js'],
      sourceLanguage: 'en'
    }
  }
>>>>>>> dev
  expect(lib.getConfig).toBeDefined()
  expect(lib.getConfig(nuxtConfig, { locales: [] })).toHaveProperty('langDir', 'lang/')
  expect(lib.getConfig(nuxtConfig, { locales: [] })).toHaveProperty('locales')
  expect(lib.getConfig(nuxtConfig, { locales: [] }).locales[0]).toHaveProperty('code', 'en')
  expect(lib.getConfig(nuxtConfig, { locales: [] }).locales[0]).toHaveProperty('file', 'en.js')
})

it('parse nuxtConfig with error Empty', () => {
  expect(lib.getConfig({}, { locales: [] })).toBeUndefined()
})

it('parse nuxtConfig with error No Locale code', () => {
  nuxtConfig = clone(conf)
  delete nuxtConfig.i18n.locales[0].code
  expect(lib.getConfig).toBeDefined()
  expect(lib.getConfig(nuxtConfig, { locales: [] })).toBeUndefined()
})

it('parse nuxtConfig with error No Locales', () => {
  nuxtConfig = clone(conf)
  delete nuxtConfig.i18n.locales
  // console.dir(nuxtConfig)
  console.dir(conf)
  expect(lib.getConfig(nuxtConfig, { locales: [] })).toBeUndefined()
})

it('parse nuxtConfig with error No Locale file', () => {
  nuxtConfig = clone(conf)
  delete nuxtConfig.i18n.locales[0].file
  expect(lib.getConfig).toBeDefined()
  expect(lib.getConfig(nuxtConfig, { locales: [] })).toBeUndefined()
})

it('parse nuxtConfig with error No langDir', () => {
  nuxtConfig = clone(conf)
  delete nuxtConfig.i18n.langDir
  expect(lib.getConfig).toBeDefined()
  expect(lib.getConfig(nuxtConfig, { locales: [] })).toBeUndefined()
})

it('parse nuxtConfig alternative', () => {
  nuxtConfig = {
    modules: [
      ['nuxt-i18n', { locales: [{ code: 'en', name: 'English', file: 'en.js' }], langDir: 'lang/' }]
    ]
  }
  expect(lib.getConfig).toBeDefined()
  expect(lib.getConfig(nuxtConfig, { locales: [] })).toHaveProperty('langDir', 'lang/')
  expect(lib.getConfig(nuxtConfig, { locales: [] })).toHaveProperty('locales')
  expect(lib.getConfig(nuxtConfig, { locales: [] }).locales[0]).toHaveProperty('code')
})
