const lib = require('../lib/includes')

it('parse config', () => {
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
  expect(lib.getConfig).toBeDefined()
  expect(lib.getConfig(conf, { locales: [] })).toHaveProperty('langDir', 'lang/')
  expect(lib.getConfig(conf, { locales: [] })).toHaveProperty('locales')
  expect(lib.getConfig(conf, { locales: [] }).locales[0]).toHaveProperty('code', 'en')
  expect(lib.getConfig(conf, { locales: [] }).locales[0]).toHaveProperty('file', 'en.js')
})

it('parse config with error Empty', () => {
  const conf = { }
  expect(lib.getConfig).toBeDefined()
  expect(lib.getConfig(conf, { locales: [] })).toBeUndefined()
})

it('parse config with error No Locales', () => {
  const conf = { i18n: { langDir: 'lang/' } }
  expect(lib.getConfig).toBeDefined()
  expect(lib.getConfig(conf, { locales: [] })).toBeUndefined()
})

it('parse config with error No Locale code', () => {
  const conf = { i18n: { langDir: 'lang/', locales: [{ file: 'en.js' }] } }
  expect(lib.getConfig).toBeDefined()
  expect(lib.getConfig(conf, { locales: [] })).toBeUndefined()
})

it('parse config with error No Locale file', () => {
  const conf = { i18n: { langDir: 'lang/', locales: [{ code: 'en' }] } }
  expect(lib.getConfig).toBeDefined()
  expect(lib.getConfig(conf, { locales: [] })).toBeUndefined()
})

it('parse config with error No langDir', () => {
  const conf = { i18n: { } }
  expect(lib.getConfig).toBeDefined()
  expect(lib.getConfig(conf, { locales: [] })).toBeUndefined()
})

it('parse config alternative', () => {
  const conf = {
    modules: [
      [
        'nuxt-i18n',
        {
          locales: [
            {
              code: 'en',
              name: 'English',
              file: 'en.js'
            }
          ],
          langDir: 'lang/'
        }
      ]
    ]
  }
  expect(lib.getConfig).toBeDefined()
  expect(lib.getConfig(conf, { locales: [] })).toHaveProperty('langDir', 'lang/')
  expect(lib.getConfig(conf, { locales: [] })).toHaveProperty('locales')
  expect(lib.getConfig(conf, { locales: [] }).locales[0]).toHaveProperty('code')
})
