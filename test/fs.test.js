const lib = require('../lib/includes')

test('search for sentences', () => {
  expect(lib.getSentences).toBeDefined()
  expect(lib.getSentences(['./test/level1'], ['*.js'])).toContain('“I will be translated”')
  expect(lib.getSentences(['./test/level1'], '*.js')).toContain('“I will be translated”')
  expect(lib.getSentences(['./test/ERROR'], ['*.js'])).toEqual([])
  expect(lib.getSentences(['./test/level1'], {})).toEqual([])
})

it('read fs recursive', async () => {
  expect(lib.getFiles).toBeDefined()
  await expect((await lib.getFiles('./test/level1', ['*.js']))[0]).toMatch(/file.js/i)
})

it('directory warning', () => {
  expect(lib.directoryWarn).toBeDefined()
  expect(lib.directoryWarn('./test/level1')).toMatch(/\/test\/level1/i)
})

test('import file', () => {
  expect(lib.importFile).toBeDefined()
  expect(lib.importFile('./test/level1/level2/file.js')).toMatchObject({})
  expect(lib.importFile('./test/level1/level2/fileXXX.js')).toBeNull()
})
