const fs = require('fs')
const inquirer = require('inquirer')
// const mockInquirer = require('mock-inquirer')
const lib = require('../lib/includes')

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
//   const backup = {}
//   // jest.mock('inquirer')
//   beforeAll(() => {
//     backup.prompt = inquirer.prompt
//     inquirer.prompt.prompts.confirm = () => { return Math.random() < 0.5 }
//     // inquirer.prompt.prompts.confirm = () => Promise.resolve(() => { return Math.random() < 0.5 ? { dir: true } : { dir: false } })
//     // inquirer.prompt. = () => { return Math.random() < 0.5 ? { dir: true } : { dir: false } }
//     // inquirer.prompt.prompts.confirm = () => Promise.resolve({ dir: true })
//     console.dir(inquirer.prompt.prompts.confirm)
//     backup.mkdirSync = fs.mkdirSync
//     fs.mkdirSync = () => {}
//     backup.writeFileSync = fs.writeFileSync
//     fs.writeFileSync = () => {}
//     fs.existsSync = () => { return Math.random() < 0.5 }
//   })
//
//   it('should equal test', async () => {
//     // expect.assertions(1);
//     for (let i = 0; i < 10; i++) {
//       await expect(lib.checkFiles({ langDir: 'test/mocks/XXX/', locales: [{ file: 'en.js' }] })).toBeTruthy()
//       await expect(lib.checkFiles({ langDir: 'test/mocks/lang/', locales: [{ file: 'ru.js' }] })).toBeTruthy()
//     }
//   })
//
//   // restore
//   afterAll(() => {
//     inquirer.prompt = backup.prompt
//     fs.writeFileSync = backup.writeFileSync
//     fs.mkdirSync = backup.mkdirSync
//   })
// })

test('files exist', () => {
  expect(lib.checkFiles()).toBeDefined()
  expect(lib.checkFiles({ langDir: 'test/mocks/lang/', locales: [{ file: 'en.js' }] })).toBeTruthy()
})
