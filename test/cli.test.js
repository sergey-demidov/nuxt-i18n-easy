const fs = require('fs')
const endOfLine = require('os').EOL
const stdin = require('mock-stdin').stdin()
const consola = require('consola')
const lib = require('../lib/includes')

const spit = (arg) => {
  stdin.send(arg)
}
describe('test user input', () => {
  const backup = {}
  beforeAll(() => {
    backup.mkdirSync = fs.mkdirSync
    backup.writeFileSync = fs.writeFileSync
    backup.copyFileSync = fs.copyFileSync
    fs.mkdirSync = () => {}
    fs.writeFileSync = () => {}
    fs.copyFileSync = () => {}
    for (const key in consola) {
      if (typeof consola[key] === 'function') {
        consola[key] = () => {}
      }
    }
  })

  it('write out', async () => {
    expect(await
    lib.writeConfig({ langFile: 'test/mocks/lang/en.js' },
      {
        Welcome: { translated: 'Welcome', lineNumber: 123, unused: false, opts: ['Welcome!'] },
        Inspire: { translated: 'Inspire', lineNumber: 234, unused: true, opts: [] }
      }).split(endOfLine))
      .toContain("  Welcome: 'Welcome', // Welcome!")
  })

  it('directory dos not exist', async () => {
    for (const c of 'yn') {
      setTimeout(spit, 100, c + '\n')
      expect(await lib.checkFiles({ langDir: 'test/mocks/XXX/', locales: [{ file: 'en.js' }] })).toBeFalsy()
    }
  })
  it('locale file dos not exist', async () => {
    for (const c of 'yn') {
      setTimeout(spit, 100, c + '\n')
      expect(await lib.checkFiles({ langDir: 'test/mocks/lang/', locales: [{ file: 'ru.js' }] })).toBeFalsy()
    }
  })
  it('directory and locale file exist', async () => {
    expect(await lib.checkFiles({ langDir: 'test/mocks/lang/', locales: [{ file: 'en.js' }] })).toBeTruthy()
  })
  afterAll(() => {
    fs.writeFileSync = backup.writeFileSync
    fs.mkdirSync = backup.mkdirSync
    fs.copyFileSync = backup.copyFileSync
    stdin.end()
  })
})
