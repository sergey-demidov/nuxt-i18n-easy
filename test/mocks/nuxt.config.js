
export default {
  modules: [
    'nuxt-i18n',
    'nuxt-i18n-easy'
  ],
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
        file: 'ru.js',
        translationCode: 'ru'
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
