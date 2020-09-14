const axios = require('axios')
const lib = require('../lib/includes')
// const jest = require('jest')
const log = console.log

beforeAll(() => {
  console.log = () => {}
})

afterAll(() => {
  console.log = log
})

jest.mock('axios')

it('translate same lang en => en', async () => {
  await expect((await lib.translate('en', 'en', 'Hello World')))
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
  const result = await lib.translate('en', 'ru', ' Continue ')
  expect(result).toEqual({ translated: ' Продолжать ', opts: ['продолжаться'] })
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
