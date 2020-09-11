import Vue from 'vue'

export default ({app}) => {
  Object.assign(String.prototype, {
    t() {
      return app.i18n.t(this);
    }
  });
  Vue.directive('translate', {
    inserted: function (el) {
      console.dir(el.innerText)
      el.innerHTML = el.innerText.t()
    }
  })
};
