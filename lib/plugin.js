// import Url from 'url'
import Vue from 'vue'

export default ({ app }) => {
  // console.dir(app)
  Object.assign(String.prototype, {
    tr() {
      return app.i18n.t(this)
    }
  })
  Object.assign(String.prototype, {
    lp() {
      return app.localePath(this)
    }
  })
  Vue.directive('tr', {
    inserted(el) {
      el.innerHTML = app.i18n.t(el.textContent.trim())
    }
  })
}
