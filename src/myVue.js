import {observer} from './observer';
import Compile from './compile';

export default class myVue {


  constructor (options) {
    this.$options = options;
    let data = this._data = this.$options.data, me = this;
    Object.keys(data).forEach((key) => {
      me._proxy(key);
    });
    observer(data, this);
    this.$compile = new Compile(options.el || document.body, this)
  }

  _proxy (key) {
    const me = this;
    Object.defineProperty(me, key, {
      configurable: false,
      enumerable: true,
      get: function proxyGetter () {
        return me._data[key];
      },
      set: function proxySetter (newVal) {
        me._data[key] = newVal;
      }
    });
  }
}

const vue = new myVue({
  el:'#app',
  data:{
    message:'hello world!'
  },
  methods:{
    test(){
      console.log('hahah');
    }
  }
});