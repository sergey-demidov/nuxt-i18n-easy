const consola = require('consola')
const lib = require('../lib/includes')

// jest.spyOn(global.console, 'log').mockImplementation(() => jest.fn())
// jest.spyOn(global.console, 'error').mockImplementation(() => jest.fn())

describe('test user input', () => {
  // const backup = {}
  beforeAll(() => {
    for (const key in consola) {
      if (typeof consola[key] === 'function') {
        consola[key] = () => {}
      }
    }
  })

  test('search for sentences', () => {
    expect(lib.getSentences).toBeDefined()
    expect(lib.getSentences(['./test/mocks/pages'], ['*.vue'])).toContain('“I will be translated”')
    expect(lib.getSentences(['./test/mocks/pages'], '*.vue')).toContain('“I will be translated”')
    expect(lib.getSentences(['./test/mocks/ERROR'], ['*.vue'])).toEqual([])
    expect(lib.getSentences(['./test/mocks/pages'], {})).toEqual([])
  })

  it('read fs recursive', async () => {
    await expect((await lib.getFiles('./test/mocks/pages', ['*.vue']))[0]).toMatch(/index.vue/)
  })

  it('directory warning', () => {
    expect(lib.directoryWarn('./test/mocks/pages')).toMatch(/\/test\/mocks\/pages/i)
  })

  it('import file', async () => {
    expect(lib.importFile('./test/mocks/lang/en.js')).toHaveProperty('Welcome')
    expect(lib.importFile('./XXX')).toBeNull()
    expect(await lib.loadConfig()).toHaveProperty('i18nEasy')
  })
  afterAll(() => {
  })
})
