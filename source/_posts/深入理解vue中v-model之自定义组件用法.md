---
title: 深入理解vue中v-model之自定义组件用法
date: 2020-09-27 00:01:57
tags:
---

根据上一篇《深入理解 vue 中 v-model 之普通用法》基本对 v-model 有了比较深的理解，接下来我们看看它如何在自定义组件中使用。

首先，我们知道下面两个用法等价的：

```html
<input v-model="msg" />
<!-- 等价于 -->
<input :value="msg" @input="msg = $event.target.value" />
```

1. 在 vue3 中

当在自定义组件中使用`v-model`时：

```html
<custom-comp v-model="msg"></custom-comp>
<!-- 等价于 -->
<custom-comp :model-value="msg" @update:model-value="msg = $event"></custom-comp>
<!-- 建议命名按照kebab-cased规范，如：model-value，而不是modelValue -->
```

那么就可以这样实现一个自定义组件的 v-model：

```js
// 示例1：自定义input组件
app.component('custom-input', {
  props: ['modelValue'],
  template: `
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    >
  `,
});
// 示例2：自定义count组件
app.component('custom-count', {
  props: {
    modelValue: Number,
  },
  methods: {
    increment() {
      this.$emit('update:modelValue', ++this.modelValue);
    },
    decrement() {
      this.$emit('update:modelValue', --this.modelValue);
    },
  },
  template: `
    <button @click="increment">+1</button> ~ 
    <button @click="decrement">-1</button>
    <p>{{modelValue}}</p>
  `,
});
```

{% codepen cleam_lee ExKMYKE light result 460 %}

2. 在 vue2 中

当在自定义组件中使用`v-model`时：

```html
<custom-comp v-model="msg"></custom-comp>
<!-- 等价于 -->
<custom-comp :value="msg" @input="msg = $event"></custom-comp>
```

> 未完待续
