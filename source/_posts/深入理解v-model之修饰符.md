---
title: 深入理解v-model之修饰符（vue3和vue2对比分析）
date: 2020-09-27 23:03:56
tags: vue
---

## vue2 中

我们知道在 vue2 中有 3 个硬编码的修饰符：`lazy`、`number`和`trim`，他们的作用分别如下：

- lazy：将触发`input`事件转为触发`change`事件，在某些场景下来降低数据同步频率提升性能。

```html
<!-- 在“change”时而非“input”时更新 -->
<input v-model.lazy="msg" />
```

- number：自动将用户的输入值转为数值类型。

```html
<input v-model.number="age" type="number" />
```

- trim：自动过滤用户输入的首尾空白字符

```html
<input v-model.trim="msg" />
```

{% codepen cleam_lee jOqRyov dark vue,result 500 %}

## vue3 中

不同于 vue2 的硬编码，在 vue3 中支持自定义修饰符：

```html
<my-component v-model.capitalize="bar"></my-component>
```

组件接收自定义修饰符：

```js
app.component('my-component', {
  props: {
    modelValue: String,
    // 组件接收属性modelModifiers对象，对象里面包含多个修饰符，这里默认给个空对象：{}
    modelModifiers: {
      default: () => ({}),
    },
  },
  template: `
    <input type="text" 
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)">
  `,
  created() {
    console.log(this.modelModifiers); // { capitalize: true }
  },
});
```

我们看到组件会接收一个属性为`modelModifiers`的对象，上面示例给出了默认值`{}`，然后在生命周期函数`created`中拿到了`修饰符capitalize的值为true`（因为在上面组件使用时绑定了`v-model.capitalize="bar"`）。

接下来，我们实现修饰符`capitalize`，即将 v-model 绑定的值首字母大写：

```js
app.component('my-component', {
  props: {
    modelValue: String,
    modelModifiers: {
      default: () => ({}),
    },
  },
  template: `
    <input type="text" 
      :value="modelValue"
      @input="emitValue">
  `,
  methods: {
    emitValue(e) {
      let v = e.target.value;
      if (this.modelModifiers.capitalize) {
        v = v.charAt(0).toUpperCase() + v.slice(1);
      }
      this.emit('update:modelValue', v);
    },
  },
});
```

我们来看看效果：

{% codepen cleam_lee zYqXwdP dark html,result 200 %}

由于 vue3 支持组件同时绑定多个带参数的 v-model（不带参数的话只有第一个 v-model 是有效的），所以在带参数的情况下，修饰符属性命名就变成了`参数名 + "Modifiers"`，我们看下面代码：

```html
<my-component
  v-model:first-name.capitalize="firstName"
  v-model:last-name.upper="lastName"
></my-component>
```

组件实现：

```js
app.component('my-component', {
  props: ['firstName', 'firstNameModifiers', 'lastName', 'lastNameModifiers'],
  template: `
    <input type="text" 
      :value="firstName"
      @input="$emit('update:firstName', $event.target.value)"> - 
    <input type="text" 
      :value="lastName"
      @input="$emit('update:lastName', $event.target.value)">
  `,
  created() {
    console.log(this.firstNameModifiers); // { capitalize: true }
    console.log(this.lastNameModifiers); // { upper: true }
  },
});
```

上面代码中，我们的参数名是`firstName`和`lastName`，所以自定义组件接收到的修饰符属性由原来的`modelModifiers`修改为`firstNameModifiers`和`lastNameModifiers`。

下面我们来看[完整的实现](https://codepen.io/cleam_lee/pen/xxVeMBJ)：

```js
// 创建APP
const app = Vue.createApp({
  data() {
    return {
      firstName: '',
      lastName: '',
    };
  },
});
// 自定义组件
app.component('my-component', {
  props: ['firstName', 'firstNameModifiers', 'lastName', 'lastNameModifiers'],
  template: `
    <p>firstName: <input type="text" :value="firstName" @input="emitCapitalize"></p>
    <p>lastName: <input type="text" :value="lastName" @input="emitReverse"></p>
  `,
  methods: {
    emitCapitalize(e) {
      let v = e.target.value;
      if (this.firstNameModifiers.capitalize) {
        v = v.charAt(0).toUpperCase() + v.slice(1);
      }
      this.$emit('update:firstName', v);
    },
    emitReverse(e) {
      let v = e.target.value;
      if (this.lastNameModifiers.upper) {
        v = v.toUpperCase();
      }
      this.$emit('update:lastName', v);
    },
  },
});
// 挂载
app.mount('#app');
```

{% codepen cleam_lee xxVeMBJ dark html,result 300 %}

至此，v-model 在 vue2 和 vue3 中的应用就基本讲完了，欢迎大家留言或加微信（cleam_lee）讨论！

> 汇总：
>
> 1. [深入理解 v-model 之表单用法（vue3 和 vue2 对比分析）](https://juejin.im/post/6877143018160259085)
> 2. [深入理解 v-model 之自定义组件用法（vue3 和 vue2 对比分析）](https://juejin.im/post/6877383634349719565)
> 3. [深入理解 v-model 之修饰符（vue3 和 vue2 对比分析）](https://juejin.im/post/6877745193097887751)
