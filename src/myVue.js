import Observer from './observer';
import Compile from './compile'

export default class MyVue {
  constructor (options) {
    this.vm = this;
    this.data = options.data;
    Object.keys(this.data).forEach((key) => {
      this._proxyKey(key);
    });
    new Observer(this.data);
    new Compile(this.vm, options.el);
  }

  _proxyKey (key) {
    Object.defineProperty(this, key, {
      enumerable: false,
      configurable: true,
      get () {
        return this.data[key];
      },
      set (newVal) {
        this.data[key] = newVal;
      }
    });
  }
}
