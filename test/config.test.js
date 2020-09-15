import conf from './mocks/nuxt.config.js'
const consola = require('consola')
const lib = require('../lib/includes')

const clone = (o) => {
  return JSON.parse(JSON.stringify(o))
}
let nuxtConfig = clone(conf)

describe('test user input', () => {
  // const backup = {}
  beforeAll(() => {
    for (const key in consola) {
      if (typeof consola[key] === 'function') {
        consola[key] = () => {}
      }
    }
  })

  it('parse nuxtConfig', () => {
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
    // console.dir(conf)
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

  afterAll(() => {
  })
})
