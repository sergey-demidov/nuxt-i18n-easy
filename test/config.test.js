const consola = require('consola')
const lib = require('../lib/includes')
const conf = './test/mocks/nuxt.config.js'

let nuxtConfig = lib.importFile(conf)

describe('test user input', () => {
  beforeAll(() => {
    for (const key in consola) {
      if (typeof consola[key] === 'function') {
        consola[key] = () => {}
      }
    }
  })

  it('parse nuxtConfig', () => {
    nuxtConfig = lib.importFile(conf)
    expect(lib.getConfig(nuxtConfig, { locales: [] })).toHaveProperty('langDir', 'lang/')
    expect(lib.getConfig(nuxtConfig, { locales: [] })).toHaveProperty('locales')
    expect(lib.getConfig(nuxtConfig, { locales: [] }).locales[0]).toHaveProperty('code', 'en')
    expect(lib.getConfig(nuxtConfig, { locales: [] }).locales[0]).toHaveProperty('file', 'en.js')
  })

  it('parse nuxtConfig with error Empty', () => {
    expect(lib.getConfig({}, { locales: [] })).toBeUndefined()
  })

  it('parse nuxtConfig with error No Locale code', () => {
    nuxtConfig = lib.importFile(conf)
    delete nuxtConfig.i18n.locales[0].code
    expect(lib.getConfig(nuxtConfig, { locales: [] })).toBeUndefined()
  })

  it('parse nuxtConfig with error No Locales', () => {
    nuxtConfig = lib.importFile(conf)
    delete nuxtConfig.i18n.locales
    expect(lib.getConfig(nuxtConfig, { locales: [] })).toBeUndefined()
  })

  it('parse nuxtConfig with error No Locale file', () => {
    nuxtConfig = lib.importFile(conf)
    delete nuxtConfig.i18n.locales[0].file
    expect(lib.getConfig(nuxtConfig, { locales: [] })).toBeUndefined()
  })

  it('parse nuxtConfig with error No langDir', () => {
    nuxtConfig = lib.importFile(conf)
    delete nuxtConfig.i18n.langDir
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

  afterAll(() => {
  })
})
