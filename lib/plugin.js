// import Url from 'url'
import Vue from 'vue'

export default ({ app }) => {
  // console.dir(app)
  Object.assign(String.prototype, {
    tr () {
      return app.i18n.t(this)
    }
  })
  Object.assign(String.prototype, {
    tl () {
      return app.localePath(this)
    }
  })
  Vue.directive('tr', {
    inserted (el) {
      if (app.context.debug) { console.dir(el) }
      // app.context.nuxtState.__i18n.langs.en
      el.innerHTML = app.i18n.t(el.textContent.trim())
    }
  })
  // Vue.directive('tl', {
  //   inserted (el) {
  //     const url = Url.parse(el.href)
  //     console.dir(el)
  //     // console.dir(url)
  //     // console.dir(app.router.query)
  //     el.href = app.localePath(url.path)
  //     // console.dir(app.localePath(el.href))
  //   }
  // })
}
