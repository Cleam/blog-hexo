function isObject(obj) {
  return obj !== null && typeof obj === 'object';
}

function defineReactive(obj, key, value) {
  observe(value);
  Object.defineProperty(obj, key, {
    get() {
      return value;
    },
    set(newValue) {
      observe(newValue);
      value = newValue;
    },
  });
}

function observe(obj) {
  // if (!isObject(obj)) {
  //   return;
  // }
  new Observer(obj);
}

function proxy(vm, prop) {
  const data = vm[prop];
  if (isObject(data)) {
    Object.keys(data).forEach((k) => {
      Object.defineProperty(vm, k, {
        get() {
          return data[k];
        },
        set(newValue) {
          data[k] = newValue;
        },
      });
    });
  }
}

// obj: {a: {b: {c: 'Hello'}}}  path: 'a.b.c'
// return 'hello'
function get(obj, path) {
  if (isObject(obj) && typeof path === 'string') {
    let pathArr = path.split('.');
    let i = 0;
    let len = pathArr.length;
    while (obj !== null && i < len) {
      obj = obj[pathArr[i++]];
    }
    return obj;
  }
}

class Vue {
  constructor(options) {
    this.$options = options;
    this.$el = document.querySelector(options.el);
    this.$data = typeof options.data === 'function' ? options.data() : options.data;
    this.$methods = options.methods;
    // 响应式
    observe(this.$data);
    // 将$data的数据代理到实例上
    proxy(this, '$data');
    // 将method代理到实例上
    proxy(this, '$methods');
    // 编译
    new Compile(this.$el, this);
  }

  $set(obj, key, value) {
    defineReactive(obj, key, value);
  }
}

class Observer {
  constructor(data) {
    this.data = data;
    if (isObject(data)) {
      this.reactiveObject(data);
    }
    if (Array.isArray(data)) {
      this.reactiveArray(data);
    }
  }
  // 对象响应化
  reactiveObject(obj) {
    Object.keys(obj).forEach((key) => {
      defineReactive(obj, key, obj[key]);
    });
  }
  // 数组响应化
  reactiveArray(arr) {
    // todo...
  }
}

class Compile {
  constructor(node, vm) {
    this.vm = vm;
    this.node = node;
    console.log(node);
    console.log(node.childNodes);
    this.traverse(node);
  }
  traverse(node) {
    Array.from(node.childNodes).forEach((n) => {
      if (this.isElementNode(n)) {
        // 元素节点
        this.compileElement(n);
      } else if (this.isTextNode(n)) {
        this.compileText(n);
      }
      if (n.childNodes && n.childNodes.length > 0) {
        this.traverse(n);
      }
    });
  }
  isElementNode(node) {
    return node.nodeType === Node.ELEMENT_NODE;
  }
  isTextNode(node) {
    return node.nodeType === Node.TEXT_NODE;
  }

  compileText(node, obj) {
    const textContent = node.textContent;
    const matches1 = textContent.match(/\{\{\w+\}\}/g); // {{count}}
    if (matches1) {
      // console.log(matches1);
      matches1.forEach((k) => {
        const newKey = k.replace(/\{\{(\w+)\}\}/, '$1');
        const re = new RegExp(`(\w*)${k}(\w*)`, 'g');
        node.textContent = node.textContent.replace(re, `$1${this.vm[newKey]}$2`);
      });
    }
    const matches2 = textContent.match(/\{\{\w+\.[\w|\.]+\}\}/g); // ["{{obj.foo.bar}}", "{{obj.baz}}"] or null
    if (matches2) {
      console.log(matches2);
      matches2.forEach((exp) => {
        const rawExp = exp.replace(/\{\{(.*)\}\}/, '$1');
        // console.log(rawExp, get(this.vm, rawExp));
      });
    }
  }

  compileElement(node) {
    for (const attr of node.attributes) {
      if (attr.name.startsWith('v-')) {
        const attrs = attr.name.slice(2).split(':');
        let directive = attrs[0];
        directive = directive.charAt(0).toUpperCase() + directive.slice(1);
        // console.log(directive);
        this[`handleDirective${directive}`](node, attrs[1]);
      }
    }
  }

  handleDirectiveText(node) {
    // console.log(node);
    const attrName = 'v-text';
    node.textContent = this.vm[node.getAttribute(attrName)];
    node.removeAttribute(attrName);
  }
  handleDirectiveHtml(node) {
    // console.log(node);
    const attrName = 'v-html';
    node.innerHTML = this.vm[node.getAttribute(attrName)];
    node.removeAttribute(attrName);
  }
  handleDirectiveBind(node, attr) {
    console.log(attr);
  }
  handleDirectiveOn(node, eventName) {
    // console.log(eventName);
    const attrName = `v-on:${eventName}`;
    node.addEventListener(eventName, this.vm[node.getAttribute(attrName)].bind(this.vm));
    node.removeAttribute(attrName);
  }
  handleDirectiveIf(node) {
    // console.log(node);
    const attrName = 'v-if';
    const value = this.vm[node.getAttribute(attrName)];
    if (!value) {
      node.remove();
    }
    node.removeAttribute(attrName);
  }
  handleDirectiveFor(node) {
    // console.log(node);
    const attrName = 'v-for';
    const expression = node.getAttribute(attrName);
    const tag = node.tagName.toLowerCase();
    if (/(\w+)\s+in\s+(\w+)/.test(expression)) {
      // const item = RegExp.$1;
      const list = this.vm[RegExp.$2]; // list
      for (const key in list) {
        const item = list[key];
        const itemEl = document.createElement(tag); // li
        const path = node.getAttribute('v-bind:key').split('.').slice(1).join('.'); // item.id but maybe item.a.id
        itemEl.setAttribute('key', get(item, path));
        // this.compileText(itemEl, item);
        node.parentNode.appendChild(itemEl);
      }
      node.remove();
    }
    node.removeAttribute(attrName);
  }
}
