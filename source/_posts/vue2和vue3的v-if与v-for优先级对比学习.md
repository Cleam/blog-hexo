---
title: vue2和vue3的v-if与v-for优先级对比学习
date: 2020-10-09 14:07:12
tags:
---

Vue.js 中使用最多的两个指令就是 `v-if` 和 `v-for`，因此我们可能会想要同时使用它们。虽然官方不建议这样做，但有时确实是必须的，我们来了解下他们的工作方式：

- 在 vue 2.x 中，在一个元素上同时使用 `v-if` 和 `v-for` 时，`v-for` 会优先作用。
- 在 vue 3.x 中，`v-if` 总是优先于 `v-for` 生效。

## 对比学习

接下来我们通过一个简单的示例来感知下，假设我们想要实现一个极简的 todoList 效果：

![todolist](/images/post/todolist.png)

我们有一个 todoList：

```js
const todoList = [
  {
    id: 0,
    task: '吃饭',
    done: true,
  },
  {
    id: 1,
    task: '睡觉',
    done: false,
  },
  {
    id: 2,
    task: '洗澡',
    done: true,
  },
  // ...,
];
```

在 vue2 中，`v-for` 优先级高于 `v-if`，我们可以这样实现：

```html
<ul>
  <!-- vue2中，v-for优先级高于v-if -->
  <li v-for="item in todoList" v-if="!item.done" :class="{todo: !item.done}" :key="item.id">
    <span>{{item.task}}</span>
  </li>
</ul>

<ul>
  <li v-for="item in todoList" v-if="item.done" :class="{finished: item.done}" :key="item.id">
    <span>{{item.task}}</span>
  </li>
</ul>
```

在 vue3 中，由于 `v-if` 优先级要高于 `v-for`，所以不能像 vue2 那样将 `v-for` 和 `v-if` 放在同一个元素上，我们在 li 外面套一层用来执行 for 循环：

```html
<ul>
  <template v-for="item in list" :key="item.id">
    <li v-if="!item.done" :class="{todo: !item.done}">
      <span>{{item.task}}</span>
    </li>
  </template>
</ul>
<ul>
  <template v-for="item in list" :key="item.id">
    <li v-if="item.done" :class="{finished: item.done}">
      <span>{{item.task}}</span>
    </li>
  </template>
</ul>
```

可以看出，如果在 vue2.x 中 `v-if` 和 `v-for` 在同一个元素上使用是无法直接在 vue3.x 中兼容的。

## 最佳实践

针对 `v-if` 和 `v-for` 的使用，其实官方是建议我们使用计算属性来处理的，这样既提高了性能，又可以兼容到 vue3.x，接下来我们看看计算属性实现方式：

模板部分：

```html
<div id="app">
  <!--  最佳实践  -->
  <ul class="todo-list">
    <li v-for="item in todos" class="todo" :key="item.id">
      <span>{{item.task}}</span>
    </li>
  </ul>

  <ul v-if="showFinished">
    <li v-for="item in finished" :key="item.id" class="finished">
      <span>{{item.task}}</span>
    </li>
  </ul>

  <p>
    show finished？
    <input type="checkbox" v-model="showFinished" />
    {{showFinished ? 'yes' : 'no'}}
  </p>
</div>
```

js 部分：

```js
// vue3.x
Vue.createApp({
  data() {
    return {
      msg: 'Todo List',
      showFinished: true,
      list: todoList,
    };
  },
  computed: {
    finished() {
      return todoList.filter(t => t.done);
    },
    todos() {
      return todoList.filter(t => !t.done);
    },
  },
}).mount('#app');

// vue2.x
new Vue({
  el: '#app',
  data() {
    return {
      msg: 'Todo List',
      showFinished: true,
      list: todoList,
    };
  },
  computed: {
    finished() {
      return todoList.filter(t => t.done);
    },
    todos() {
      return todoList.filter(t => !t.done);
    },
  },
});
```

示例效果：

{% codepen cleam_lee rNLamWq dark js,result 400 %}

## 总结

1. vue2.x 中`v-for`优先级高于`v-if`，vue3.x 相反；
2. 尽量避免在同一个元素上面同时使用`v-if`和`v-for`，建议使用计算属性替代。
