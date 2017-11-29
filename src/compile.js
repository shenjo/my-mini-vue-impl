import compileUtil from './CompileUtil';

export default class Compile{

  constructor (e,vm) {
    this.$vm = vm;
    this.$el = Compile.isElementNode(el) ? el : document.querySelector(el);
    if (this.$el) {
      this.$fragment = Compile.node2Fragment(this.$el);
      this.init();
      this.$el.appendChild(this.$fragment);
    }
  }

  init(){
    this.compileElement(this.$fragment);
  }

  compileElement(el) {
    const childNodes = el.childNodes, me = this;
    [].slice.call(childNodes).forEach((node) =>{
      const text = node.textContent;
      const reg = /\{\{(.*)\}\}/;    // 表达式文本
      // 按元素节点方式编译
      if (Compile.isElementNode(node)) {
        me.compile(node);
      } else if (Compile.isTextNode(node) && reg.test(text)) {
        me.compileText(node, RegExp.$1);
      }
      // 遍历编译子节点
      if (node.childNodes && node.childNodes.length) {
        me.compileElement(node);
      }
    });
  }

  static isElementNode(node) {
    return node.nodeType === 1;
  }

  static isTextNode(node) {
    return node.nodeType === 3;
  }

  compile(node) {
    var nodeAttrs = node.attributes, me = this;
    [].slice.call(nodeAttrs).forEach(function(attr) {
      // 规定：指令以 v-xxx 命名
      // 如 <span v-text="content"></span> 中指令为 v-text
      var attrName = attr.name;    // v-text
      if (me.isDirective(attrName)) {
        var exp = attr.value; // content
        var dir = attrName.substring(2);    // text
        if (me.isEventDirective(dir)) {
          // 事件指令, 如 v-on:click
          compileUtil.eventHandler(node, me.$vm, exp, dir);
        } else {
          // 普通指令
          compileUtil[dir] && compileUtil[dir](node, me.$vm, exp);
        }
      }
    });
  }

  compileText(node, exp) {
    compileUtil.text(node, this.$vm, exp);
  }

  static node2Fragment(el) {
    let fragment = document.createDocumentFragment(), child;
    while (child = el.firstChild) {
      fragment.appendChild(child);
    }
    return fragment;
  }
}