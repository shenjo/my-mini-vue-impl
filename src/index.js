import Observer from './observer';
import Watcher from './Watcher';

const selfValue = function(data, el, exp) {
  this.data = data;
  new Observer(this.data);
  el.innerHTML = this.data[exp];
  new Watcher(this, exp, (value) => {
    el.innerHTML = value;
  });
  return this;
};

const ele = document.querySelector('#name');
const selfVue = new selfValue({
  name: 'hello world'
}, ele, 'name');
window.setTimeout(function() {
  console.log('name值改变了');
  selfVue.data.name = 'canfoo';
}, 2000);
