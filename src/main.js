const __app = require('./app.js').default;

export default {
  install: (app, options) => {
    if(options) __app.setup(options);
    app.config.globalProperties.$a = __app;
    app.$a = __app;
    app.provide('$a',__app);
  }
}
