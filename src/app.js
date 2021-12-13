const _get = require('lodash/get');
const _mergeDash = require('lodash/mergeWith');
const _assign = require('lodash/assign');
const _clone = require('lodash/cloneDeep');
const _merge = function (dest,src,srcIndex,all) {
  _mergeDash(dest,src,srcIndex,function (objValue, srcValue, key, object, source){
    const lead = key.substr(0,1);
    if(lead==='_' && !all) return undefined;
    if(lead==='~') {
      const key2=key.substr(1);
      object[key2]=source[key];
      return dest;
    }
    return undefined;
  });
};


class tenApp {
  //setup
  constructor(){
    if(!tenApp.instance) {
      tenApp.instance = this;
      this._defaults = {
      };
      this._settings = {};
    }
  }

  get(name,def) {
    return _get(this,_settins,name,def);
  }

  replace(str,hash) {
    return this._replace(str,hash)
  }

  setup(options, isDefault) {
    if(options) {
      if(options["~settings"]) {
        this.setup({"app":options["~settings"]});
      }
      if(options.settings) {
        Object.keys(options.settings).forEach((key)=> {
          this.set(options.settings[key],key,isDefault);
        })
      }
    }
  }

  set(settings, isDefault) {
    if(isDefault) {
      _assign(this._defaults,_clone(settings));
      _merge(this._settings,settings);
    } else {
      _assign(this._settings,settings);
    }
    _merge(this._locales[localeCode],_clone(settings));
  }

  _replace(str, hash) {
    hash = hash || tenApp.instance._settings;
    let typ = typeof str;
    if (typ === 'string'){
      let keys = str.match(/\{+(\w*)}+/g);
      if (keys === undefined || keys===null) return str;

      for (let i = 0; i < keys.length; i++){
        let key = keys[i];
        let name = key.replace(/[{}]/g, '');
        if (name === undefined || name === '') continue;

        let value = this._get(name,null,true, hash);
        if (value === undefined) continue;
        let re = new RegExp('\\{' + name + '\\}', 'g');
        str = str.replace(re, value);
      }
      return str;
    }
    if (typ === 'object'){
      if(Array.isArray(str)) {
        for (let i = 0; i < str.length; i++){
          str[i] = this._replace(str[i],hash);
        }
        return str;
      }
      Object.keys(str).forEach((key)=>{
        this._replace(str[key],hash);
      })
    }
    return str;
  }
}

const instance = new tenApp();

export default instance;
