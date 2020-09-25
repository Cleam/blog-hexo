---
title: vue2和vue3的v-model
date: 2020-09-25 15:51:54
tags:
---

> vue2 指 vue2.2.0+

## v-model 普通用法

普通用法，vue3 和 vue2 没区别。

```html
<template>
  <div id="app">
    <!-- input -->
    <input v-model="msg" placeholder="请输入..." />
    <p>消息: {{ msg }}</p></p>
    <hr>
    <!-- checkbox -->
    <label>
      <input type="checkbox" id="c1" value="apple" v-model="cv" />苹果
    </label>
    <label>
      <input type="checkbox" id="c2" value="banner" v-model="cv" />香蕉
    </label>
    <p>水果: {{ cv }}</p>
    <hr>
    <!-- radio -->
    <label>
      <input type="radio" id="r1" value="male" v-model="rv" />男
    </label>
    <label>
      <input type="radio" id="r2" value="female" v-model="rv" />女
    </label>
    <p>性别: {{ rv }}</p>
  </div>
</template>
```

{% codepen cleam_lee PoNVMPd light result 350 %}

## 自定义组件的 v-model

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

<未完待续>
