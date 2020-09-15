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
    expect(lib.getFiles).toBeDefined()
    await expect((await lib.getFiles('./test/mocks/pages', ['*.vue']))[0]).toMatch(/index.vue/)
  })

  it('directory warning', () => {
    expect(lib.directoryWarn).toBeDefined()
    expect(lib.directoryWarn('./test/mocks/pages')).toMatch(/\/test\/mocks\/pages/i)
  })

  it('import file', () => {
    expect(lib.importFile).toBeDefined()
    expect(lib.importFile('./test/mocks/nuxt.config.js')).toMatchObject({})
    expect(lib.importFile('./XXX')).toBeNull()
  })
  afterAll(() => {
  })
})
