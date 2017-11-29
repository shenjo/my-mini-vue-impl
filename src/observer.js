import Dep from './Dep';

export default class Observer {

  constructor (data) {

    this.observer(data);
  }

  observer (data) {
    if (!data || typeof data !== 'object') {
      return;
    }
    Object.keys(data).forEach((key) => {
      this.defineReactive(data, key, data[key]);
    });
  }

  defineReactive (obj, key, val) {
    let dep = new Dep();
    new Observer(obj[key]);
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: false,
      get: function() {
        if (Dep.target) {
          dep.addSub(Dep.target);
        }
        return val;
      },
      set: function(newVal) {
        val = newVal;
        dep.notify();
      }
    })
  }
}

