const { resolve } = require('path')

module.exports = function (moduleOptions) {
  const options = {
    ...this.options['nuxt-i18n-translate'],
    ...moduleOptions
  }

  this.addPlugin({
    src: resolve(__dirname, 'plugin.js'),
    fileName: 'nuxt-i18n-translate.js',
    options
  })
}

module.exports.meta = require('../package.json')
