export default class Dep {
  constructor () {
    this._subs = [];
  }

  addSub (sub) {
    console.log(`exp = ${sub.exp} has successfully subscribe.`);
    this._subs.push(sub);
  }

  notify () {
    console.log(`there are ${this._subs.length} need to update.`);
    this._subs.forEach((sub) => {
      sub.update();
    })
  }
}

Dep.target = null;