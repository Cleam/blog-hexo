---
title: Learn Array.reduce
date: 2018-11-22 14:00:36
tags: JavaScript
---

## 方法解释

`arr.reduce(callback[, initialValue])`对数组中的每一个元素执行你提供的一个回调方法（callback）并返回一个结果值。下面我们通过示例来详细了解下。

## 示例（累加操作）

```javascript
// 定义一个数组
const arr = [1, 2, 3, 4, 5];
// 定义一个callback函数，它接收4个参数
const callback = (acc, cur, currentIndex, sourceArr) => {
  console.log(`arr[${currentIndex}]: ${cur}`); // 对比查看提供与不提供初始值initialValue时的执行情况
  return acc + cur;
};
// 执行reduce操作，接收返回值
const returnValue1 = arr.reduce(callback); // 不提供initialValue
// 打印返回值结果
console.log(returnValue1); // 打印结果：15

// 执行reduce操作，接收返回值
const returnValue2 = arr.reduce(callback, 5); // 提供initialValue为5
// 打印返回值结果
console.log(returnValue2); // 打印结果：20
```

## callback 函数接收的 4 个参数说明

- 累加值（acc）（理解：上一次`callback`的返回值，当做下一次`callback`的第一个参数。）
- 当前值（cur）
- 当前索引（currentIndex）
- 原数组（sourceArr）

## 理解`reduce()`

- 如果没有提供初始值（`initialValue`），`reduce()`将从数组索引 1（也就是第 2 个元素）开始执行`callback`（跳过数组的第 1 个元素），此时，`acc`等于数组的第一个元素值（即`arr[0]`），`cur`等于数组的第 2 个元素值（即`arr[1]`）
- 如果提供了初始值（`initialValue`）,`reduce()`将从数组索引 0（也就是第 1 个元素）开始执行`callback`，此时，`acc`等于`initialValue`的值，`cur`等于数组的第 1 个元素值（即`arr[0]`）

## 边缘情况

- 如果数组`arr`为空且没有提供初始值`initialValue`，代码将报`TypeError`错误
- 如果数组只有一个值（`arr.length === 1`）且没有提供初始值`initialValue` 或 提供了初始值`initialValue`但数组`arr`为空，则直接返回那个唯一的值且回调方法`callback`不会被调用

```javascript
const arr = [1];
const callback = (acc, cur, currentIndex, sourceArr) => {
  console.log(`arr[${currentIndex}]: ${cur}`); // 未执行
  return acc + cur;
};
const returnValue1 = arr.reduce(callback);
console.log(returnValue1); // 打印结果：1

const arr2 = [];
const callback2 = (acc, cur, currentIndex, sourceArr) => {
  console.log(`arr2[${currentIndex}]: ${cur}`); // 未执行
  return acc + cur;
};
const returnValue2 = arr2.reduce(callback2, 5);
console.log(returnValue2); // 打印结果：5

const arr3 = [];
const callback3 = (acc, cur, currentIndex, sourceArr) => {
  return acc + cur;
};
arr3.reduce(callback3); // Uncaught TypeError: Reduce of empty array with no initial value
```
