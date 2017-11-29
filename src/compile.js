import Watcher from './Watcher';

export default class Compile {
  constructor (vm, el) {
    this.vm = vm;
    this.fragment = null
    this.el = document.querySelector(el);
    this.init();
  }

  init () {
    if (this.el) {
      this.fragment = Compile.nodeToFragment(this.el);
      this.compileElement(this.fragment);
      this.el.appendChild(this.fragment);
    } else {
      console.log('DOM 不存在');
    }
  }

  compile (node) {
    const nodeAttrs = node.attributes;
    [...nodeAttrs].forEach((attr) => {
      let attrName = attr.name;
      if (Compile.isDirective(attrName)) {
        let directive = attrName.substring(2);
        if (Compile.isModelDirective(directive)) {
          this.compileModel(attr, node);
        } else {
          //todo: add more directive
        }
      }
    })
  }

  compileModel (attr, node) {
    let val = this.vm[attr.value];
    Compile.modelUpdate(node, val);
    new Watcher(this.vm, attr.value, (value) => {
      Compile.modelUpdate(node, value)
    });
    node.addEventListener('input', (e) => {
      const newValue = e.target.value;
      if (val === newValue) {
        return;
      }
      this.vm[attr.value] = newValue;
      val = newValue;
    });
  }

  compileElement (ele) {
    const childNodes = ele.childNodes;
    childNodes.forEach((node) => {
      const regex = /\{\{(.*)\}\}/;
      let text = node.textContent;
      if (Compile.isElementNode(node)) {
        this.compile(node);
      } else if (Compile.isTextNode(node) && regex.test(text)) {
        this.compileTextNode(node, regex.exec(text)[1]);
      }
      if (node.childNodes && node.childNodes.length) {
        this.compileElement(node);
      }
    })
  }

  compileTextNode (node, exp) {
    const oldValue = this.vm[exp];
    Compile.updateText(node, oldValue);
    new Watcher(this.vm, exp, (value) => {
      Compile.updateText(node, value);
    });

  }

  static isDirective (attr) {
    return attr.indexOf("v-") !== -1;
  }

  static isModelDirective (attr) {
    return "model" === attr;
  }

  static nodeToFragment (ele) {
    const fragment = document.createDocumentFragment();
    let child = ele.firstChild;
    while (child) {
      fragment.appendChild(child);
      child = ele.firstChild;
    }
    return fragment;
  }

  static updateText (node, value) {
    node.textContent = typeof value === 'undefined' ? '' : value;
  }

  static isTextNode (node) {
    return node.nodeType === 3;
  }

  static isElementNode (node) {
    return node.nodeType === 1;
  }

  static modelUpdate (node, value) {
    node.value = typeof value === 'undefined' ? '' : value;
  }
}

