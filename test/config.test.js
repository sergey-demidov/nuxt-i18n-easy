const consola = require('consola')
const lib = require('../lib/includes')

const clone = (source) => {
  return JSON.parse(JSON.stringify(source))
}

describe('test config load', () => {
  beforeAll(() => {
    for (const key in consola) {
      if (typeof consola[key] === 'function') {
        consola[key] = () => {}
      }
    }
  })

  it('parse nuxtConfig', async () => {
    const nuxtConfig = await lib.loadConfig()
    lib.config = { locales: [] }
    expect(lib.getConfig).toBeDefined()
    expect(lib.getConfig(nuxtConfig)).toHaveProperty('langDir', 'lang/')
    expect(lib.getConfig(nuxtConfig)).toHaveProperty('locales')
    expect(lib.getConfig(nuxtConfig).locales[0]).toHaveProperty('code', 'en')
    expect(lib.getConfig(nuxtConfig).locales[0]).toHaveProperty('file', 'en.js')
  })
  it('clone', () => {
    expect(clone).toBeDefined()
    expect(clone({ test: 'test' })).toMatchObject({ test: 'test' })
  })

  it('parse nuxtConfig with error Empty', () => {
    lib.config = { locales: [] }
    expect(lib.getConfig({})).toBeUndefined()
  })

  it('parse nuxtConfig with error No Locale code', async () => {
    let nuxtConfig = await lib.loadConfig()
    nuxtConfig = clone(nuxtConfig)
    delete nuxtConfig.i18n.locales[0].code
    expect(lib.getConfig(nuxtConfig, { locales: [] })).toBeUndefined()
  })

  it('parse nuxtConfig with error No Locale file', async () => {
    let nuxtConfig = await lib.loadConfig()
    nuxtConfig = clone(nuxtConfig)
    delete nuxtConfig.i18n.locales[0].file
    expect(lib.getConfig(nuxtConfig, { locales: [] })).toBeUndefined()
  })

  it('parse nuxtConfig with error No Locales', async () => {
    let nuxtConfig = await lib.loadConfig()
    nuxtConfig = clone(nuxtConfig)
    delete nuxtConfig.i18n.locales
    expect(lib.getConfig(nuxtConfig, { locales: [] })).toBeUndefined()
  })
  it('parse nuxtConfig with error Locales Empty', async () => {
    let nuxtConfig = await lib.loadConfig()
    nuxtConfig = clone(nuxtConfig)
    nuxtConfig.i18n.locales = []
    expect(lib.getConfig(nuxtConfig, { locales: [] })).toBeUndefined()
  })

  it('parse nuxtConfig with error No langDir', async () => {
    let nuxtConfig = await lib.loadConfig()
    nuxtConfig = clone(nuxtConfig)
    delete nuxtConfig.i18n.langDir
    expect(lib.getConfig(nuxtConfig, { locales: [] })).toBeUndefined()
  })

  it('parse nuxtConfig alternative', () => {
    const nuxtConfig = {
      modules: [
        ['nuxt-i18n', { locales: [{ code: 'en', name: 'English', file: 'en.js' }], langDir: 'lang/' }]
      ]
    }
    expect(lib.getConfig(nuxtConfig, { locales: [] })).toHaveProperty('langDir', 'lang/')
    expect(lib.getConfig(nuxtConfig, { locales: [] })).toHaveProperty('locales')
    expect(lib.getConfig(nuxtConfig, { locales: [] }).locales[0]).toHaveProperty('code')
  })

  afterAll(() => {
  })
})
