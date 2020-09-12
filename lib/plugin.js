import Vue from 'vue'

export default ({ app }) => {
  console.dir(app)
  Object.assign(String.prototype, {
    tr () {
      return app.i18n.t(this)
    }
  })
  Vue.directive('tr', {
    inserted (el) {
      console.dir(el.textContent)
      el.innerHTML = app.i18n.t(el.textContent)
    }
  })
}
