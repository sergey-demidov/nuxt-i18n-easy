const lib = require('../lib/includes')

test('search for sentences', () => {
  expect(lib.getSentences).toBeDefined()
  expect(lib.getSentences(['./test/mocks/pages'], ['*.vue'])).toContain('“I will be translated”')
  expect(lib.getSentences(['./test/mocks/pages'], '*.vue')).toContain('“I will be translated”')
  expect(lib.getSentences(['./test/mocks/ERROR'], ['*.js'])).toEqual([])
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

test('import file', () => {
  expect(lib.importFile).toBeDefined()
  expect(lib.importFile('./test/mocks/nuxt.config.js')).toMatchObject({})
  expect(lib.importFile('./XXX')).toBeNull()
})
