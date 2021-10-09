---
title: sonar质量规则学习之JavaScript
date: 2021-10-09 18:11:10
tags:
  - sonar
  - JavaScript
  - 翻译
---

该文档列出了比较容易违反、比较重要的几个规则，更多规则请查看：[sonar rules for js](https://rules.sonarsource.com/javascript)

## 代码段不应被注释掉（[Sections of code should not be commented out](https://rules.sonarsource.com/javascript/RSPEC-125)）

程序员不应注释掉代码，因为它会使程序膨胀并降低可读性。未使用的代码应该被删除，如果需要，可以从源代码控制历史（如：Git History）中检索。

有些情况可能会误报、不合理报错或者本来就是有用的注释，可以试试使用`//NOSONAR`来规避：

![js with sonar warn](/uploads/post/js.png)

加上`//NOSONAR`，sonar扫描便会忽略掉，就不会再有警告：

![js with NOSONAR](/uploads/post/js-nosonar.png)

## 功能函数认知复杂度（圈复杂度）不应太高（[Cognitive Complexity of functions should not be too high](https://rules.sonarsource.com/javascript/RSPEC-3776)）

认知复杂性是衡量函数控制流理解难度的指标。认知复杂度高的功能将难以维护。详情请看《{% post_link cognitive-complexity %}》

## 变量不应该被隐藏（[Variables should not be shadowed](https://rules.sonarsource.com/javascript/RSPEC-1117)）

重写或隐藏在外部作用域中声明的变量会严重影响代码的可读性，从而影响代码的可维护性。此外，这可能会导致维护人员引入 bug，因为他们认为自己在使用某一个变量，但实际上在使用另一个变量。

## 三元运算符不应该嵌套（[Ternary operators should not be nested](https://rules.sonarsource.com/javascript/RSPEC-3358)）

三元运算符嵌套虽然可以解决问题，刚开始编写的时候看起来可能很清晰，但是随着时间延长会增加后期的维护难度。

反例：

```js
function getReadableStatus(job) {
  return job.isRunning() ? 'Running' : job.hasErrors() ? 'Failed' : 'Succeeded '; // Noncompliant
}
```

正例：

```js
function getReadableStatus(job) {
  if (job.isRunning()) {
    return 'Running';
  }
  return job.hasErrors() ? 'Failed' : 'Succeeded';
}
```

## 应删除未使用的分配（变量）（[Unused assignments should be removed](https://rules.sonarsource.com/javascript/RSPEC-1854)）

定义了一个变量并对其进行了赋值操作，但实际上却未使用。可能是错误操作导致（比如代码删错），也可能是失误多写了。但总归是无用的，可以删除掉。

反例：

```js
i = a + b; // Noncompliant; calculation result not used before value is overwritten
i = compute();
```

正例：

```js
i = a + b;
i += compute();
```

例外情况:

- 初始化值为`-1, 0, 1, null, undefined, [], {}, true, false, ""`的会被该规则忽略
- 此规则还忽略使用 rest 语法（用于从对象中排除某些属性）进行对象分解时声明的变量

```js
let { a, b, ...rest } = obj; // 'a' and 'b' are ok
doSomething(rest);

let [x1, x2, x3] = arr; // but 'x1' is noncompliant, as omitting syntax can be used: "let [, x2, x3] = arr;"
doSomething(x2, x3);
```

## “for of”应该与可迭代对象一起使用（["for of" should be used with Iterables](https://rules.sonarsource.com/javascript/RSPEC-4138)）

如果您有一个可迭代对象，例如数组、集合或列表，则循环遍历其值的最佳选择是 for of 语法。 这可以使代码看起来更干净、清晰。

反例：

```js
const arr = [4, 3, 2, 1];

for (let i = 0; i < arr.length; i++) {
  // Noncompliant
  console.log(arr[i]);
}
```

正例：

```js
const arr = [4, 3, 2, 1];

for (let value of arr) {
  console.log(value);
}
```

## 应删除未使用的局部变量或函数（[Unused local variables and functions should be removed](https://rules.sonarsource.com/javascript/RSPEC-1481)）

如果声明了局部变量或局部函数但未使用，则它是死代码，应删除。 这样做将提高可维护性，因为开发人员不会想知道变量或函数的用途。

反例：

```js
function numberOfMinutes(hours) {
  var seconds = 0; // seconds is never used
  return hours * 60;
}
```

正例：

```js
function numberOfMinutes(hours) {
  return hours * 60;
}
```

## 函数不应有相同的实现（[Functions should not have identical implementations](https://rules.sonarsource.com/javascript/RSPEC-4144)）

当两个函数具有相同的实现时，要么是一个错误（有其他用途），要么重复是故意的，但可能会使维护者感到困惑。 在后一种情况下，应该重构代码。

反例：

```js
function calculateCode() {
  doTheThing();
  doOtherThing();
  return code;
}

function getName() {
  // Noncompliant
  doTheThing();
  doOtherThing();
  return code;
}
```

正例：

```js
function calculateCode() {
  doTheThing();
  doOtherThing();
  return code;
}

function getName() {
  return calculateCode();
}
```

## 不应有空函数（[Functions should not be empty](https://rules.sonarsource.com/javascript/RSPEC-1186)）

函数没有函数体有几个原因：

- 这是一个无意的遗漏，应该修复以防止生产中出现意外行为。
- 它尚未或永远不会得到支持。 在这种情况下，应该在该机制可用的语言中抛出异常。
- 该方法是一个有意的空白覆盖。 在这种情况下，嵌套注释应解释空白覆盖的原因。

反例：

```js
function foo() {}

var foo = () => {};
```

正例：

```js
function foo() {
  // This is intentional
}

var foo = () => {
  do_something();
};
```

## 分配（的变量）不应是多余的（[Assignments should not be redundant](https://rules.sonarsource.com/javascript/RSPEC-4165)）

有些变量分配是没必要的，所以可以优化掉。

反例：

```js
a = b;
c = a;
b = c; // Noncompliant: c and b are already the same
```

正例：

```js
a = b;
c = a;
```

## 不应在子表达式中进行赋值（[Assignments should not be made from within sub-expressions](https://rules.sonarsource.com/javascript/RSPEC-1121)）

子表达式中的赋值很难被发现，因此降低了代码的可读性。 理想情况下，子表达式不应该有副作用。

反例：

```js
if ((val = value() && check())) {
  // Noncompliant
  // ...
}
```

正例：

```js
val = value();
if (val && check()) {
  // ...
}
```

## 不应声明局部变量然后立即返回或抛出（[Local variables should not be declared and then immediately returned or thrown](https://rules.sonarsource.com/javascript/RSPEC-1488)）

声明一个变量只是为了立即返回或抛出它是一种不好的做法。

一些开发人员认为这种做法提高了代码的可读性，因为它使他们能够明确地命名返回的内容。 然而，这个变量是一个内部实现细节，不会暴露给方法的调用者。 方法名称应该足以让调用者确切地知道将返回什么。

反例：

```js
function computeDurationInMilliseconds() {
  var duration = ((hours * 60 + minutes) * 60 + seconds) * 1000;
  return duration;
}
```

正例：

```js
function computeDurationInMilliseconds() {
  return ((hours * 60 + minutes) * 60 + seconds) * 1000;
}
```

## 条件结构中的两个分支不应具有完全相同的实现（[Two branches in a conditional structure should not have exactly the same implementation](https://rules.sonarsource.com/javascript/RSPEC-1871)）

> 类似规则：条件结构中的所有分支不应具有完全相同的实现([All branches in a conditional structure should not have exactly the same implementation](https://rules.sonarsource.com/javascript/RSPEC-3923))

switch 语句中的两个 case 或 if 链中的两个分支具有相同的实现充其量是重复代码，最坏的情况是编码错误。 如果两个实例确实需要相同的逻辑，那么在 if 链中它们应该被组合，或者对于一个 switch，一个应该落到另一个。

反例：

```js
switch (i) {
  case 1:
    doFirstThing();
    doSomething();
    break;
  case 2:
    doSomethingDifferent();
    break;
  case 3: // 不合规; 与case 1的实现重复
    doFirstThing();
    doSomething();
    break;
  default:
    doTheRest();
}

if (a >= 0 && a < 10) {
  doFirstThing();
  doTheThing();
} else if (a >= 10 && a < 20) {
  doTheOtherThing();
} else if (a >= 20 && a < 50) {
  doFirstThing();
  doTheThing(); // 不合规; 与第一个条件的实现重复
} else {
  doTheRest();
}
```

例外情况：

if 链中包含单行代码的块将被忽略，就像 switch 语句中包含单行代码（带有或不带有后续中断）的块一样。

```js
if (a == 1) {
  doSomething(); // 没问题，通常这样做是为了提高可读性
} else if (a == 2) {
  doSomethingElse();
} else {
  doSomething();
}
```

但是这个例外不适用于**没有 else 的 if 链**，或者当所有分支都具有相同的单行代码时**没有 default 子句的 switch**。 如果 if 链带有 else 或带有 default 子句的 switch，规则 {rule:javascript:S3923} 会引发错误。

```js
if (a == 1) {
  doSomething(); // 不合规，这可能是故意的（也可能不是）
} else if (a == 2) {
  doSomething();
}
```

## 不应该在比较中使用布尔字面量（[Boolean literals should not be used in comparisons](https://rules.sonarsource.com/javascript/RSPEC-1125)）

在比较表达式 == 和 != 中应避免使用布尔字面量，以提高代码可读性。此规则还报告冗余的布尔运算。

反例：

```js
let someValue = '0';
// ...

if (someValue == true) {
  /* ... */
}
if (someBooleanValue != true) {
  /* ... */
}
doSomething(!false);
```

正例：

```js
if (someValue && someValue != '0') {
  /* ... */
}
if (!someBooleanValue) {
  /* ... */
}
doSomething(true);
```

## 跳转语句不应冗余（[Jump statements should not be redundant](https://rules.sonarsource.com/javascript/RSPEC-3626)）

跳转语句，例如 return、break 和 continue 可以让你改变程序执行的默认流程，但是将控制流引导到原始方向是多余的。

反例：

```js
function redundantJump(x) {
  if (x == 1) {
    console.log('x == 1');
    return; // Noncompliant
  }
}
```

正例：

```js
function redundantJump(x) {
  if (x == 1) {
    console.log('x == 1');
  }
}
```

例外情况：

- switch 语句中的 break 和 return 被忽略，因为它们经常用于保持一致性。
- continue with label 也被忽略，因为标签通常用于清晰起见。
- 此外，块中作为单个语句的跳转语句也将被忽略。

## 不应使用已弃用的 API（[Deprecated APIs should not be used](https://rules.sonarsource.com/javascript/RSPEC-1874)）

## 默认导出名称和文件名应匹配（[Default export names and file names should match](https://rules.sonarsource.com/javascript/RSPEC-3317)）

按照惯例，只导出一个类、函数或常量的文件应该以该类、函数或常量命名。 否则可能使维护者感到困惑。

反例：

```js
// file path: myclass.js  -- Noncompliant
class MyClass {
  // ...
}
export default MyClass;
```

正例：

```js
// file path: MyClass.js
class MyClass {
  // ...
}
export default MyClass;
```

## 函数应该总是返回同样的类型（[Functions should always return the same type](https://rules.sonarsource.com/javascript/RSPEC-3800)）

与强类型语言不同，JavaScript 不强制函数的返回类型。 这意味着通过函数的不同路径可以返回不同类型的值，这可能会让使用者感到非常困惑并且难以维护。

反例：

```js
// Noncompliant
function foo(a) {
  if (a === 1) {
    return true;
  }
  return 3;
}
```

正例：

```js
function foo(a) {
  if (a === 1) {
    return true;
  }
  return false;
}
```

例外：返回 this 的函数将被忽略。

```js
function foo() {
  // ...
  return this;
}
```

返回类型为 any 的表达式的函数将被忽略。

## 没用到的引入应该删除掉（[Unnecessary imports should be removed](https://rules.sonarsource.com/javascript/RSPEC-1128)）

没有理由导入你不使用的模块，这样做不必要地增加了负载。

反例：

```js
// Noncompliant, A isn't used
import A from 'a';
import { B1 } from 'b';

console.log(B1);
```

正例：

```js
import { B1 } from 'b';

console.log(B1);
```

## 不应使用“void”（["void" should not be used](https://rules.sonarsource.com/javascript/RSPEC-3735)）

void 运算符评估其参数并无条件地返回 undefined。 它在 ECMAScript 5 之前的环境中很有用， undefined 可以重新分配。但通常，它的使用会使代码更难理解。

反例：

```js
void doSomething();
```

正例：

```js
doSomething();
```

例外：当使用 `void 0` 代替 undefined 时不会出现问题。

```js
if (parameter === void 0) {...}
```

在立即调用的函数表达式之前使用 void 时，也不会出现问题。

```js
void (function() {
   ...
}());
```

## 带有默认值的函数参数应该放到最后（[Function parameters with default values should be last](https://rules.sonarsource.com/javascript/RSPEC-1788)）

为函数参数定义默认值可以使函数更易于使用。默认参数值允许调用者根据需要指定尽可能多或尽可能少的参数，同时获得相同的功能并最大限度地减少样板(boilerplate)、包装器(wrapper)类似的代码。

但是所有带默认值的函数参数都应该在没有默认值的函数参数之后声明。否则，调用者就无法利用默认值；他们必须重新指定默认值或传递 `undefined` 以“获取”非默认参数。

反例：

```js
// Noncompliant
function multiply(a = 1, b) {
  return a * b;
}

var x = multiply(42); // returns NaN as b is undefined
```

正例：

```js
function multiply(b, a = 1) {
  return a * b;
}

var x = multiply(42); // returns 42 as expected
```

## 不应访问或迭代空集合（[Empty collections should not be accessed or iterated](https://rules.sonarsource.com/javascript/RSPEC-4158)）

当集合为空时，访问或迭代它是没有意义的。 无论如何这样做肯定是错误的。

反例：

```js
let strings = [];

if (strings.includes("foo")) { ... }  // Noncompliant

for (str of strings) { ... }  // Noncompliant

strings.forEach(str => doSomething(str)); // Noncompliant
```

## 内置函数的参数应该类型匹配（[Arguments to built-in functions should match documented types](https://rules.sonarsource.com/javascript/RSPEC-3782)）

JavaScript 语言规范中指定了内置函数的参数类型。 对这些函数的调用应符合规定的类型，否则结果很可能不是预期的，例如：

反例：

```js
const isTooSmall = Math.abs(x < 0.0042);
```

正例：

```js
const isTooSmall = Math.abs(x) < 0.0042;
```

## 内置函数的参数应该类型匹配（[Boolean checks should not be inverted](https://rules.sonarsource.com/javascript/RSPEC-1940)）

反转布尔比较增加了不必要的代码复杂度。应该进行相反的比较。

反例：

```js
if (!(a === 2)) { ... }  // Noncompliant
```

正例：

```js
if (a !== 2) { ... }
```

## 不应忽略没有副作用的函数的返回值（[Return values from functions without side effects should not be ignored](https://rules.sonarsource.com/javascript/RSPEC-2201)）

当对函数的调用没有任何副作用时，如果结果被忽略，调用的意义何在？ 在这种情况下，要么函数调用没用，应该删除，要么源代码没有按预期运行。

为防止产生任何误报，此规则仅在已知对象和功能的预定义列表上触发问题。

反例：

```js
'hello'.lastIndexOf('e'); // Noncompliant
```

正例：

```js
let char = 'hello'.lastIndexOf('e');
```

违反此规则的代码中，使用`map`进行循环的情况最多，如果不需要循环返回值，请使用`forEach`代替。

## 不应重复声明变量和函数（[Variables and functions should not be redeclared](https://rules.sonarsource.com/javascript/RSPEC-2814)）

实际上，可以多次使用相同的符号作为变量或函数，但这样做可能会使维护者感到困惑。此外，这种重新分配可能是错误的，开发人员没有意识到变量的值被新的分配覆盖了。

此规则也适用于函数参数。

反例：

```js
var a = 'foo';
function a() {} // Noncompliant
console.log(a); // prints "foo"

function myFunc(arg) {
  var arg = 'event'; // Noncompliant, argument value is lost
}

fun(); // prints "bar"

function fun() {
  console.log('foo');
}

fun(); // prints "bar"

// Noncompliant
function fun() {
  console.log('bar');
}

fun(); // prints "bar"
```

正例：

```js
var a = 'foo';
function otherName() {}
console.log(a);

function myFunc(arg) {
  var newName = 'event';
}

fun(); // prints "foo"

function fun() {
  print('foo');
}

fun(); // prints "foo"

function printBar() {
  print('bar');
}

printBar(); // prints "bar"
```

## 数组方法的回调应该有返回（return 语句）（[Callbacks of array methods should have return statements](https://rules.sonarsource.com/javascript/RSPEC-3796)）

JavaScript 中的数组有几种（过滤、映射或折叠）需要回调的方法。在这样的回调函数中没有 return 语句很可能是一个错误，因为数组的处理使用了回调的返回值。 如果没有返回，回调将隐式返回 undefined，这可能会失败。

此规则适用于数组的以下方法：

- `Array.from`
- `Array.prototype.every`
- `Array.prototype.filter`
- `Array.prototype.find`
- `Array.prototype.findIndex`
- `Array.prototype.map`
- `Array.prototype.reduce`
- `Array.prototype.reduceRight`
- `Array.prototype.some`
- `Array.prototype.sort`

反例：

```js
let arr = ['a', 'b', 'c'];
let merged = arr.reduce(function (a, b) {
  a.concat(b);
}); // Noncompliant: No return statement, will result in TypeError
```

正例：

```js
let arr = ['a', 'b', 'c'];
let merged = arr.reduce(function (a, b) {
  return a.concat(b);
}); // merged === "abc"
```

违反此规则的代码中，使用`map`进行循环的情况最多，如果不需要循环返回值，请使用`forEach`代替。

## 严格相等运算符不应与不同类型一起使用（[Strict equality operators should not be used with dissimilar types](https://rules.sonarsource.com/javascript/RSPEC-3403)）

使用严格相等运算符 `===` 和 `!==` 比较不同的类型将始终返回相同的值，分别为 `false` 和 `true`，因为在比较之前没有进行类型转换。因此，这种比较是错误的。

反例：

```js
var a = 8;
var b = '8';

// Noncompliant; always false
if (a === b) {
  // ...
}
```

正例：

```js
var a = 8;
var b = '8';

if (a == b) {
  // ...
}

// or

var a = 8;
var b = '8';

if (a === Number(b)) {
  // ...
}
```

## “switch”语句应该至少有 3 个“case”子句（["switch" statements should have at least 3 "case" clauses](https://rules.sonarsource.com/javascript/RSPEC-1301)）

当同一个表达式的值有许多不同的情况时，switch 语句很有用。但是，对于一两种情况，使用 if 语句会使代码更具可读性。

反例：

```js
switch (variable) {
  case 0:
    doSomething();
    break;
  default:
    doSomethingElse();
    break;
}
```

正例：

```js
if (variable == 0) {
  doSomething();
} else {
  doSomethingElse();
}
```

## 应使用集合和数组内容（[Collection and array contents should be used](https://rules.sonarsource.com/javascript/RSPEC-4030)）

当一个集合被填充但它的内容从未被使用时，那么它肯定是某种错误。要么重构使集合变得毫无意义，要么缺少访问权限。

当除了添加或删除值的方法之外没有对集合调用任何方法时，此规则会引发问题。

反例：

```js
function getLength(a, b, c) {
  const strings = []; // Noncompliant
  strings.push(a);
  strings.push(b);
  strings.push(c);

  return a.length + b.length + c.length;
}
```

正例：

```js
function getLength(a, b, c) {
  return a.length + b.length + c.length;
}
```

## 跳转语句不应该是多余的（[Jump statements should not be redundant](https://rules.sonarsource.com/javascript/RSPEC-3626)）

跳转语句，例如 `return`、`break` 和 `continue` 可以让你改变程序执行的默认流程，但是将控制流引导到原始方向的跳转语句是多余的。

反例：

```js
function redundantJump(x) {
  if (x == 1) {
    console.log('x == 1');
    return; // Noncompliant
  }
}
```

正例：

```js
function redundantJump(x) {
  if (x == 1) {
    console.log('x == 1');
  }
}
```

例外：

`switch` 语句中的 `break` 和 `return` 被忽略，因为它们经常用于保持一致性。 `continue` with label 也会被忽略，因为标签通常用于清晰起见。 此外，块中作为单个语句的跳转语句也将被忽略。

## “await”不应该被重复使用（["await" should not be used redundantly](https://rules.sonarsource.com/javascript/RSPEC-4326)）

异步函数总是将返回值包装在 Promise 中。 因此，使用 `return await` 是多余的。

反例：

```js
async function foo() {
  // ...
}

async function bar() {
  // ...
  return await foo(); // Noncompliant
}
```

正例：

```js
async function foo() {
  // ...
}

async function bar() {
  // ...
  return foo();
}
```

## “await”不应该被重复使用（[Non-empty statements should change control flow or have at least one side-effect](https://rules.sonarsource.com/javascript/RSPEC-905)）

任何没有副作用且不会导致控制流改变的语句（空语句除外，这意味着语句只包含一个分号;）通常会指示编程错误，因此应该重构。

反例：

```js
a == 1; // Noncompliant; was assignment intended?
var msg = "Hello, "
  "World!"; // Noncompliant; have we forgotten '+' operator on previous line?
```

## 相关的“if/else if”语句不应具有相同的条件（[Related "if/else if" statements should not have the same condition](https://rules.sonarsource.com/javascript/RSPEC-905)）

从上到下评估 `if/else if` 语句链。 最多只会执行一个分支：第一个条件为真的分支。

因此，复制条件会自动导致死代码。通常，这是由于复制/粘贴错误造成的。充其量只是死代码，最糟糕的是，它是一个错误，在维护代码时可能会引发更多错误，显然它可能导致意外行为。

请注意，此规则要求 Node.js 在分析期间可用。

反例：

```js
if (param == 1)
  openWindow();
else if (param == 2)
  closeWindow();
else if (param == 1)  // Noncompliant
  moveWindowToTheBackground();
```

正例：

```js
if (param == 1)
  openWindow();
else if (param == 2)
  closeWindow();
else if (param == 3)
  moveWindowToTheBackground();
```