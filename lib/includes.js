const fs = require('fs')
const path = require('path')
const minimatch = require('minimatch')

const ns = {}
ns.URL = '\nPlease refer documentation on https://github.com/demid74/nuxt-i18n-easy'
ns.example = `\nExample \x1B[4mnuxt.nuxt.js\x1B[0m :\n
\x1B[90mexport default {\x1B[36m
  i18n: {
    locales: [
      {
        code: 'en',
        name: 'English',
        file: 'en.js',
      },
      {
        code: 'ru',
        name: 'Русский',
        file: 'ru.js',
      }
    ],
    lazy: true,
    langDir: 'lang/'
  },
  i18nTranslate: {
    directories: [                // default directories for search
      './layouts',
      './pages',
      './components'
    ],
    files: ['*.vue', '*.js'],     // default files
    sourceLanguage: 'en'          // default source language
  },
  \x1B[90m\n...\n
  modules: [\x1B[36m
    'nuxt-i18n',
    'nuxt-i18n-translate'\x1B[90m
  ],
  \x1B[0m`

ns.getFiles = (root, masks) => {
  let res = []
  const files = fs.readdirSync(root)
  files.forEach((file) => {
    const filename = path.join(root, file)
    const stat = fs.lstatSync(filename)
    if (stat.isDirectory()) {
      res = res.concat(ns.getFiles(filename, masks)) // recursive
    } else {
      masks.forEach((mask) => {
        if (minimatch(file, mask)) {
          res.push(filename)
        }
      })
    }
  })
  return res
}

ns.directoryWarn = (langDir) => {
  return `Directory \x1B[36m${langDir}\x1B[0m dos not exist.
You need to create this directory

\x1B[36m            mkdir ${langDir} \x1B[0m

or specify it correctly in \x1B[4m\x1B[4mnuxt.nuxtConfig.js\x1B[0m\x1B[0m\n${ns.URL}`
}

module.exports = ns
