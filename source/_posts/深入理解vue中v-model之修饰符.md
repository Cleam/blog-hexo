---
title: 深入理解vue中v-model之修饰符
date: 2020-09-27 23:03:56
tags: vue
---

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

> TODO...
