---
title: 实现一个mini版本的vue3
date: 2020-10-12 16:47:06
tags:
---

首先，假如我们需要实现的功能如下，那么，我们要怎么实现`MiniVue3`呢？

```html
<div id="app"></div>
<script src="MiniVue3.js"></script>
<script>
  const { h, mount, patch } = MiniVue3;
  // h(tagName: string[, props/attributes: object, children: array])
  // exp: h('div', {id: 'xxx', class: 'xxx'}, ['span'])
  // exp: h('div', {id: 'xxx', class: 'xxx'}, [h('span', ['Hello'])])

  // mount(vDom, container)
  // path(oldVDom, newVDom)

  const vDomDiv1 = h('div', { id: 'red' }, [h('span', ['Hello'])]);
  mount(vDomDiv1, '#app');
  // 期望渲染结果：<div id="red"><span>Hello</span></div>

  const vDomDiv2 = h('div', { id: 'green' }, [h('span', ['World'])]);
  patch(vDomDiv1, vDomDiv2);
  // 期望渲染结果：<div id="green"><span>World</span></div>
</script>
```
