const __app = require('./app.js').default;

export default {
  install: function(Vue,options,isDefault) {
    if(Vue.provide) Vue.provide('$l',__app);
    else Object.defineProperty(Vue.prototype, '$l', { value:__app });

    __app.setup(options, isDefault);
  }
}
