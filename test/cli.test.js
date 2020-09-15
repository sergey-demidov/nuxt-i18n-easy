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
      .toContain('  Welcome: \'Welcome\', // Welcome! ')
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

// describe('Module test', () => {
//   it('user input', async () => {
//     expect.assertions(1)
//     // console.dir(new inquirer.prompt.prompts.confirm({name: 'dir'}))
//     // inquirer.prompt = () => { return { answers: { dir: true } } }
//     // inquirer.prompt = jest.fn().mockResolvedValue({ dir: true })
//
//     expect(await lib.checkFiles({ langDir: 'test/mocks/XXX/', locales: [{ file: 'en.js' }] })).toBeFalsy()
//   })
// })
//
// jest.mock('inquirer')

// describe('Module test', () => {
//   test('user input', () => {
//     // expect.assertions(1)
//     // inquirer.prompt = jest.fn().mockResolvedValue(true)
//     // inquirer.prompt = () => { return true }
//     mockInquirer([{
//       when: true // will auto fill 'world'
//     }, {
//     // if anwsers is empty, mockInquirer will fill with default value
//     }])
//     expect(lib.checkFiles({ langDir: 'test/mocks/XXX/', locales: [{ file: 'en.js' }] })).toBeTruthy()
//     // expect(module()).resolves.toEqual({ email: 'some@example.com' })
//   })
// })

// describe('files not exist', () => {
//   // const backup = {}
//   //   // jest.mock('inquirer')
//   beforeAll(() => {
//     //     backup.prompt = inquirer.prompt
//     //     // inquirer.prompt.prompts.confirm = () => Promise.resolve(() => { return Math.random() < 0.5 ? { dir: true } : { dir: false } })
//     //     // inquirer.prompt. = () => { return Math.random() < 0.5 ? { dir: true } : { dir: false } }
//     inquirer.prompt.prompts.confirm = () => Promise.resolve(true)
//     //     console.dir(inquirer.prompt.prompts.confirm)
//     //     backup.mkdirSync = fs.mkdirSync
//     //     fs.mkdirSync = () => {}
//     //     backup.writeFileSync = fs.writeFileSync
//     //     fs.writeFileSync = () => {}
//     // backup.existsSync = fs.existsSync()
//
//     // fs.existsSync = () => { return Math.random() < 0.5 }
//   })
//
//   it('should equal test', async () => {
//     inquirer.prompt.prompts.confirm = () => { return Math.random() < 0.5 }
//     // expect.assertions(1);
//     for (let i = 0; i < 10; i++) {
//       await expect(lib.checkFiles({ langDir: 'test/mocks/XXX/', locales: [{ file: 'en.js' }] })).toBeTruthy()
//       await expect(lib.checkFiles({ langDir: 'test/mocks/lang/', locales: [{ file: 'ru.js' }] })).toBeTruthy()
//     }
//   })
//   //
//   //   // restore
//   afterAll(() => {
//     //     inquirer.prompt = backup.prompt
//     //     fs.writeFileSync = backup.writeFileSync
//     //     fs.mkdirSync = backup.mkdirSync
//     // fs.existsSync = backup.existsSync
//   })
// })

// test('files exist', () => {
//   expect(lib.checkFiles()).toBeDefined()
//   expect(lib.checkFiles({ langDir: 'test/mocks/lang/', locales: [{ file: 'en.js' }] })).toBeTruthy()
// })
