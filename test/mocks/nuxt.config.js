
export default {
  i18n: {
    locales: [
      {
        code: 'en',
        name: 'English',
        file: 'en.js'
      },
      {
        code: 'ru',
        name: 'Русский',
        file: 'ru.js'
      }
    ],
    lazy: true,
    langDir: 'lang/'
  },
  i18nEasy: {
    directories: [ // default directories for search
      './layouts',
      './pages',
      './components'
    ],
    files: ['*.vue', '*.js'], // default files
    sourceLanguage: 'en' // default source language
  }
}
