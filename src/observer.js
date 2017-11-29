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
    this.observer(obj[key]);
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: false,
      get: function() {
        if (Dep.target) {
          dep.subs.push(Dep.target);
        }
        return val;
      },
      set: function(newVal) {
        console.log(`detect change from ${val} ===> ${newVal}`);
        val = newVal;
        dep.notify();
      }
    })
  }
}

