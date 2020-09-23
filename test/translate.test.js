// const fs = require('fs')
const axios = require('axios')
const consola = require('consola')
const lib = require('../lib/includes')
// const jest = require('jest')

jest.mock('axios')
// jest.mock('fs')

describe('test user input', () => {
  // const backup = {}
  beforeAll(() => {
    for (const key in consola) {
      if (typeof consola[key] === 'function') {
        consola[key] = () => {}
      }
    }
  })

  // lib.processSentences = async (phrases, sourceLanguage, locale) => {

  it('processSentences', async () => {
    // fs.readFileSync.mockResolvedValue({ })
    const res = [
      [['Продолжать', 'Continue', null, null, 1]],
      [['verb', ['продолжаться']]]]
    axios.get.mockResolvedValue({ data: res })

    expect((await lib.processSentences(['Continue'], 'en', { langFile: 'test/mocks/lang/en.js' })))
      .toMatchObject({ Continue: { opts: 'продолжаться', translated: 'Продолжать', unused: false } })

    expect((await lib.processSentences(['Continue '], 'en', { langFile: 'test/mocks/lang/en.js' })))
      .toMatchObject({ 'Continue ': { opts: 'продолжаться', translated: 'Продолжать ', unused: false } })

    expect((await lib.processSentences([' Continue'], 'en', { langFile: 'test/mocks/lang/en.js' })))
      .toMatchObject({ ' Continue': { opts: 'продолжаться', translated: ' Продолжать', unused: false } })

    expect((await lib.processSentences(['Continue', 'Continue'], 'en', { langFile: 'test/mocks/lang/en.js' })))
      .toMatchObject({ Continue: { opts: 'продолжаться', translated: 'Продолжать', unused: false } })

    expect((await lib.processSentences(['Continue'], 'en', { langFile: 'test/mocks/lang/ERROR_NAMED.js' })))
      .toMatchObject({ Continue: { opts: 'продолжаться', translated: 'Продолжать', unused: false } })

    expect((await lib.processSentences(['I will be translated', '“I will be translated”', 'Welcome']
      , 'en', { langFile: 'test/mocks/lang/en.js' }))).toBeNull()
  })

  it('translate same lang en => en', async () => {
    expect((await lib.translate('en', 'en', 'Hello World')))
      .toMatchObject({ translated: 'Hello World', opts: [] })
  })

  it('translate same lang en => en', async () => {
    expect((await lib.translate('en', 'en', 'Hello World')))
      .toMatchObject({ translated: 'Hello World', opts: [] })
  })

  it('translate diff lang en => ru', async () => {
    const res = [
      [['Продолжать', 'Continue', null, null, 1]],
      [['verb', ['продолжаться']]]]
    axios.get.mockResolvedValue({ data: res })
    const result = await lib.translate('en', 'ru', 'Continue')
    expect(result).toEqual({ translated: 'Продолжать', opts: ['продолжаться'] })
  })

  it('translate diff lang en => ru width spaces', async () => {
    const res = [
      [['Продолжать', 'Continue', null, null, 1]],
      [['verb', ['продолжаться']]]]
    axios.get.mockResolvedValue({ data: res })
    let result = await lib.translate('en', 'ru', 'Continue ')
    expect(result).toEqual({ translated: 'Продолжать ', opts: ['продолжаться'] })
    result = await lib.translate('en', 'ru', ' Continue')
    expect(result).toEqual({ translated: ' Продолжать', opts: ['продолжаться'] })
  })

  it('translate width html entity number', async () => {
    const res = [
      [['"Продолжать"', 'Continue', null, null, 1]],
      [['verb', ['продолжаться']]]]
    axios.get.mockResolvedValue({ data: res })
    const result = await lib.translate('en', 'ru', '&#8220;Continue&#8221;')
    expect(result).toEqual({ translated: '"Продолжать"', opts: ['продолжаться'] })
  })
  it('translate width various sentences', async () => {
    const res = [[
      ['«Во-первых, решите проблему. '],
      ['Затем напишите код. '],
      ['И, наконец, отправьте их на github ».'], [null]]]
    axios.get.mockResolvedValue({ data: res })
    const result = await lib.translate('en', 'ru', '“First, solve the problem. Then, write the code. And finally push them to github.”')
    expect(result).toEqual({ translated: '«Во-первых, решите проблему. Затем напишите код. И, наконец, отправьте их на github ».', opts: [] })
  })

  it('translate width error', async () => {
    const res = []
    axios.get.mockResolvedValue({ data: res })
    const result = await lib.translate('en', 'ru', 'Continue')
    expect(result).toEqual({ translated: 'Continue', opts: [] })
  })
  afterAll(() => {
  })
})
