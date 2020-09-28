---
title: 深入理解v-model之自定义组件用法
date: 2020-09-27 00:01:57
tags: vue
---

根据上一篇《深入理解 v-model 之表单用法》基本对 v-model 有了比较深的理解，接下来我们看看它如何在自定义组件中使用。

首先，我们知道下面两个用法等价的：

```html
<input v-model="msg" />
<!-- 等价于 -->
<input :value="msg" @input="msg = $event.target.value" />
```

## 在 vue3 中

当在自定义组件中使用`v-model`时，组件接收一个属性`modelValue`的值，然后通过触发`update:modelValue`事件来更新该值：

```html
<custom-comp v-model="msg"></custom-comp>
<!-- 等价于 -->
<custom-comp :model-value="msg" @update:model-value="msg = $event"></custom-comp>
<!-- 建议命名按照kebab-cased规范，如：model-value，而不是modelValue -->
```

### v-model 实现

根据上面的定义规则，我们可以这样实现一个自定义 input 组件：

```js
// 示例1：自定义input组件
// 实现1：
app.component('custom-input', {
  props: ['modelValue'],
  template: `
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    >
  `,
});
// 实现2：使用input的v-model + computed(计算属性)
app.component('custom-input', {
  props: ['modelValue'],
  computed: {
    value: {
      get() {
        return this.modelValue;
      },
      set(v) {
        this.$emit('update:modelValue', v);
      },
    },
  },
  template: `
    <input v-model="value">
  `,
});
```

使用：

```html
<custom-input v-model="msg"></custom-input>;
```

上面示例只是对 input 做了一层包装，如果自定义组件里面不包含 input 又该如何实现呢？为了加深理解，我们看下面一个自定义 count 组件示例：

```js
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

使用：

```html
<custom-count v-model="num"></custom-count>;
```

我们来看看实现效果：

{% codepen cleam_lee ExKMYKE dark js,result 460 %}

### v-model 参数

通过示例我们发现 v-model 是接收属性`modelValue`的值，然后触发事件`update:modelValue`来更新该值，那么我们可不可以修改这个属性名`modelValue`呢？该如何操作？其实我们只需要给`v-model`添加参数即可，比如：`v-model:mv`，这样就将`modelValue`换成了`mv`。

我们来将上面的自定义组件改造一下：

```js
app.component('custom-input', {
  props: ['mv'],
  template: `
    <input
      :value="mv"
      @input="$emit('update:mv', $event.target.value)"
    >
  `,
});
```

使用方式就变成了：

```html
<custom-count v-model:mv="num"></custom-count>;
```

### 多个 v-model 绑定

正是由于 vue3 中新增了 v-model 的参数传递，所以自定义组件可以同时支持`多个v-model`的绑定：

```html
<user-name v-model:first-name="firstName" v-model:last-name="lastName"></user-name>
```

组件实现就变成了：

```js
app.component('user-name', {
  props: {
    firstName: String,
    lastName: String,
  },
  template: `
    <input 
      type="text"
      :value="firstName"
      @input="$emit('update:firstName', $event.target.value)">

    <input
      type="text"
      :value="lastName"
      @input="$emit('update:lastName', $event.target.value)">
  `,
});
```

{% codepen cleam_lee MWyRpvg dark html,result 300 %}

## 在 vue2 中

当在自定义组件中使用`v-model`时，组件接收一个属性`value`的值，然后通过触发`input`事件来更新该值，这样便实现了`v-model`：

```html
<custom-comp v-model="msg"></custom-comp>
<!-- 等价于 -->
<custom-comp :value="msg" @input="msg = $event"></custom-comp>
```

### v-model 实现

实现方式类似，我们看下 vue2 中实现一个自定义 input 组件：

```js
// 示例1：自定义input组件
Vue.component('comp-input', {
  props: {
    value: String,
  },
  template: `
    <input
      type="text"
      :value="value"
      @input="$emit('input', $event.target.value)"
    >
  `,
});
```

### 自定义 v-model 属性

同样在 vue2 中也支持修改接收的属性名，只是和 vue3 不同，vue2 是通过在组件中指定属性 `model` 的 `prop` 和 `event` 来修改：

```js
// 示例2：自定义count组件
Vue.component('custom-count', {
  model: {
    prop: 'v', // default: value
    event: 'i', // default: input
  },
  props: {
    v: Number,
  },
  data() {
    return {
      count: this.v,
    };
  },
  template: `<button @click="$emit('i', ++count)">+1</button>`,
});
```

我们看到在这个示例里面多了一个`model属性`，并指定了两个属性：`prop`和`event`，没错，这正是 v-model 需要的属性和事件名，只是他们的默认值为`value`和`input`，我们通过修改 model 属性的 prop 和 event 就实现了自定义。

在线效果：

{% codepen cleam_lee mdPvWvY dark vue,result 300 %}

> 关于为什么要出来一个 model 属性，[官方文档](https://cn.vuejs.org/v2/guide/components-custom-events.html#%E8%87%AA%E5%AE%9A%E4%B9%89%E7%BB%84%E4%BB%B6%E7%9A%84-v-model)也有说明，就是为了避免和 value 值有其他用途时和 v-model 产生冲突，比如单选框、复选框，具体可以查看官方[示例](https://cn.vuejs.org/v2/guide/components-custom-events.html#%E8%87%AA%E5%AE%9A%E4%B9%89%E7%BB%84%E4%BB%B6%E7%9A%84-v-model)。

## 总结

自定义组件的 v-model 我们通过在 vue3 和 vue2 中的实现都讲解了一遍，而且也能发现了其中的差异：

1. vue3 默认属性名、事件名为：`modelValue`和`update:modelValue`；而 vue2 中则是：`value`和`input`；
2. vue3 中直接通过 v-model 后面参数`v-model:foo`来指定属性名，而且修改体现在父组件中，并且`支持绑定多个 v-model`；而 vue2 中通过子组件的`model 属性中的prop值和event值`来指定属性名和事件名，修改体现在子组件中。

接下来我们来看下一篇：《深入理解 vue 中 v-model 之修饰符》。
