---
title: Javascript内建对象Math学习
date: 2020-03-02 11:07:23
tags: JavaScript
---

Math 既不能当做一般函数来调用，也不能用于 new 操作符来创建对象。

Math 的属性都是不可修改的，因此他们都以名字大写的方式来表示自己与一般属性变量的不同。

数字 Π：

```javascript
Math.PI;
3.141592653589793;
```

2 的平方根：

```javascript
Math.SQRT2;
1.4142135623730951;
```

欧拉常数 e：

```javascript
Math.E;
2.718281828459045;
```

2 的自然对数：

```javascript
Math.LN2;
0.6931471805599453;
```

10 的自然对数：

```javascript
Math.LN10;
2.302585092994046;
```

random()所返回的是 0 到 1 之间的某个数，下面给出一些常用示例：

1、获取 0 到 100 之间的某个数：

```javascript
100 * Math.random();
```

2、获取 max 和 min 之间的值，可以通过一个公式(`(max - min) * Math.random() + min`)来获取。如获取 2 到 10 之间的某个数：

```javascript
8 * Math.random() + 2;
```

如果只需要整数的话，使用`Math.floor()`用于舍弃和`Math.ceil()`用于取入，也可以直接调用`Math.round()`进行四舍五入：

```javascript
Math.floor(1.23);
Math.floor(1.63);
Math.ceil(1.23);
Math.ceil(1.63);
Math.round(1.23);
Math.round(1.63);
```

获取随机数 0 或 1：

```javascript
Math.round(Math.random());
```

`Math.max()`获取最大值、`Math.min()`获取最小值：

```javascript
Math.max(2, 5);
Math.min(2, 5);
Math.max(2, 5, 3, 9, 10, 11);
Math.min(12, 5, 3, 9, 10, 11);
```

示例：对表单中输入的月份进行验证时，可以使用下面方式来确保数据正常工作：

```javascript
Math.min(Math.max(1, input), 12);
```

Math 的其他数学计算方法：

- 指数运算(2 的 3 次方)：

```javascript
Math.pow(2, 3); // 8
```

- 平方根：

```javascript
Math.sqrt(9); // 3
```

- 正弦、余弦函数：

```javascript
Math.sin(number);
Math.cos(number);
```

> 其中 number 的为弧度值，返回参数 number 的正弦值，返回值介于 [-1, 1] 之间。

`角度 = 360 * 弧度 / (2 * Math.PI)`
化简为：
`角度 = 180 * 弧度 / Math.PI`
