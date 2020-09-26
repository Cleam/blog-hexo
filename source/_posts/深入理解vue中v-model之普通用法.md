---
title: 深入理解vue中v-model之普通用法
date: 2020-09-25 15:51:54
tags: vue
---

我们知道`v-model`主要用于进行表单项（input、textarea、select）的输入绑定，本质上只是一个语法糖，它负责监听用户的输入事件以更新数据。

`v-model` 在内部为不同的输入元素使用不同的 property 并抛出不同的事件：

- `text` 和 `textarea` 元素使用 `value` property 和 `input` 事件；
- `checkbox` 和 `radio` 使用 `checked` property 和 `change` 事件；
- `select` 字段将 `value` 作为 prop 并将 `change` 作为事件。

如何理解，我们看下面代码，对比直接使用`官方 v-model` 以及`自定义实现 v-model`：

```html
<input type="text" v-model="msg" value="msg" />
<!-- 等价于 -->
<input type="text" :value="msg" @input="msg = $event.target.value" />

<input type="text" v-model="ck" />
<!-- 等价于 -->
<input type="checkbox" :checked="ck" @change="ck=$event.target.checked" />

<select v-model="selected">
  <option value="" disable>--请选择--</option>
  <option value="dog">小狗</option>
  <option value="cat">小猫</option>
  <option value="hamster">小仓鼠</option>
</select>
<span>Selected: {{ selected }}</span>
<!-- 等价于 -->
<select :value="selected" @change="selected=$event.target.value">
  <option value="" disable>--请选择--</option>
  <option value="dog">小狗</option>
  <option value="cat">小猫</option>
  <option value="hamster">小仓鼠</option>
  <span>Selected: {{ selected }}</span>
</select>
```

然后我们来看一个完整示例：

{% codepen cleam_lee PoNVMPd light result 300 %}

可以看出，实现出来效果是一样的。（可以通过修改注释代码查看效果）

但是在使用 `radio` 和 `checkbox` 的时候，我们一般是以组的形式使用，我们一般不需要 checked 的值，而是需要 value 的值，这个时候我们可以这么使用：

```html
<label> <input type="checkbox" name="fruit" value="apple" v-model="cv" />苹果 </label>
<label> <input type="checkbox" name="fruit" value="banana" v-model="cv" />香蕉 </label>
<!-- 等价于 -->
<label>
  <input
    type="checkbox"
    name="fruit"
    value="apple"
    :checked="cv.includes('apple')"
    @change="
      $event.target.checked ? cv.push($event.target.value) : cv.splice($event.target.value, 1)
    "
  />苹果
</label>
<label>
  <input
    type="checkbox"
    name="fruit"
    value="banana"
    :checked="cv.includes('banana')"
    @change="
      $event.target.checked ? cv.push($event.target.value) : cv.splice($event.target.value, 1)
    "
  />香蕉
</label>

<p>性别: {{ rv }}</p>
<label> <input type="radio" name="gender" value="male" v-model="rv" />男 </label>
<label> <input type="radio" name="gender" value="female" v-model="rv" />女 </label>
<!-- 等价于 -->
<label>
  <input
    type="radio"
    name="gender"
    value="male"
    :checked="rv === 'male'"
    @change="$event.target.checked ? (rv = $event.target.value) : ''"
  />男
</label>
<label>
  <input
    type="radio"
    name="gender"
    value="female"
    :checked="rv === 'female'"
    @change="$event.target.checked ? (rv = $event.target.value) : ''"
  />女
</label>
```

**注意：**`checkbox组`得到的值是一个数组，而 `radio组`得到的是单个值。

{% codepen cleam_lee YzqgOzQ light result 300 %}

可以看出，针对`radio组`和`chackbox组`，我们一样可以通过自定义实现 v-model 的效果。
接下来，我们看看`v-model`在自定义组件中的使用，以及对比其在 vue3 和 vue2 中的区别。

请看下一篇文章：《深入理解 vue 中 v-model 之自定义组件用法》。
