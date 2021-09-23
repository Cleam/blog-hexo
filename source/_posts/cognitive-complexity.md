---
title: 认知复杂度（cognitive complexity ）
date: 2021-09-23 09:44:30
tags:
  - sonar
  - JavaScript
  - 翻译
---

> 2021 年 4 月 5 日，1.5 版本

## 摘要

圈复杂度（Cyclomatic Complexity）最初被表述为对模块控制流的“可测试性和可维护性”的度量。 虽然它擅长测量前者，但其基础数学模型在产生测量后者的值方面并不令人满意。本白皮书描述了一种新指标，它打破了使用数学模型来评估代码的方式，以弥补圈复杂度的缺点，并产生一种更准确地反映理解难度的度量指标，从而更准确地反映维护方法、类和应用程序的相对难度。

## 术语解释

虽然认知复杂度是一种与语言无关的度量标准，它同样适用于文件（files）和类（classes），以及方法（methods）、过程（procedures）、函数（functions）等，但为了方便起见，使用了面向对象的术语“`类（class）`”和“`方法（method）`”。

## 介绍

Thomas J. McCabe 的圈复杂度长期以来一直是衡量方法控制流复杂度的事实标准。它最初的目的是“识别难以测试或维护的软件模块”[1]，但虽然它准确计算了完全覆盖一个方法所需的最少测试用例数，但它并不是一个令人满意的可理解性度量。这是因为具有相同圈复杂度的方法不一定给维护者带来相同的难度，导致测量通过高估某些结构而低估其他结构的“假象”。

同时，圈复杂度不再是全面的。它于 1976 年在 Fortran 环境中制定，不包括现代语言结构，如`try/catch`和`lambdas`。

最后，因为每个方法的最小圈复杂度分数为 1，所以不可能知道任何具有高聚合圈复杂度的给定类是属于大型的、易于维护的类还是具有复杂控制流的小类。除了`类级别`之外，人们普遍认为应用程序的圈复杂度分数与其代码行总数相关。换句话说，圈复杂度在`方法级别`之上几乎没有用处。

作为这些问题的补救措施，认知复杂度（Cognitive Complexity）已被制定于解决现代语言结构，并在类和应用程序级别产生有意义的值。更重要的是，它脱离了基于数学模型评估代码的实践，因此它可以产生与程序员对理解这些流程所需的心理或认知相对应的控制流评估。

## 举例说明

以它旨在解决的问题为例，开始讨论认知复杂性是很有用的。 以下两种方法具有相同的圈复杂度，但在可理解性方面却截然不同。

```java
// 示例1：
int sumOfPrimes(int max) { // +1
  int total = 0;
  OUT: for (int i = 1; i <= max; ++i) { // +1
    for (int j = 2; j < i; ++j) { // +1
      if (i % j == 0) { // +1
        continue OUT;
      }
    }
    total += i;
  }
  return total;
} // Cyclomatic Complexity 4

// 示例2：
String getWords(int number) { // +1
  switch (number) {
    case 1: // +1
      return "one";
    case 2: // +1
      return "a couple";
    case 3: // +1
      return “a few”;
    default:
      return "lots";
  }
} // Cyclomatic Complexity 4
```

**圈复杂度（Cyclomatic Complexity）**底层的数学模型赋予这两种方法同等的权重，但从直观上看，`sumOfPrimes`的控制流程比`getWords`的控制流程更难理解。 这就是为什么**认知复杂度（Cognitive Complexity）**放弃使用数学模型来评估控制流，转而使用一组简单的规则将程序员的直觉转化为数字。

## （衡量）基本标准和方法

认知复杂度分数根据三个基本规则进行评估：

1. **忽略**允许将多个语句易于理解地**简写**成一个的情况
2. 在代码线性流程中的每一次中断都增加（+1）（复杂度）
3. 断流结构嵌套时增加（复杂度）

此外，复杂性分数由四种不同类型的增量组成：

A. 嵌套（Nesting） - 评估在彼此内部嵌套控制流结构
B. 结构化（Structural） - 对受嵌套增量影响并增加嵌套计数的控制流结构进行评估
C. 基本（Fundamental） - 评估不受嵌套增量约束的语句
D. 混合（Hybrid） - 对不受嵌套增量影响但确实增加嵌套计数的控制流结构进行评估

虽然增量的类型在数学上没有区别 - 每个增量都会在最终分数上+1 - 区分正在计算的特征类别可以更容易地理解嵌套增量适用和不适用的地方。

这些规则及其背后的原则将在以下各节中进一步详述。

## 忽略简写

制定认知复杂度的一个指导原则是它应该激励良好的编码实践。也就是说，它应该忽略或忽略使代码更具可读性的功能。

方法结构本身就是一个很好的例子。将代码分解成方法允许您将多个语句压缩成一个单一的、令人回味的命名调用，即“简写”它。因此，方法的认知复杂度不会增加。

认知复杂度还忽略了在许多语言中发现的空合并运算符，同样是因为它们允许将多行代码简写为一行。 例如，以下两个代码示例执行相同的操作：

```java
// 示例1：
MyObj myObj = null;
if (a != null) {
   myObj = a.myObj;
}
// 示例2：
MyObj myObj = a?.myObj;
```

示例 1 的含义需要一点时间来处理，而一旦您理解了空合并语法，示例 2 的含义就会立即清晰。 出于这个原因，认知复杂度会忽略空合并运算符。

## 线性流中断的增量（Increment for breaks in the linear flow）

认知复杂度的另一个指导原则是，（从上到下、从左到右的正常线性流程中的）破坏性代码结构会增加维护人员的理解难度。为了承认这种额外的努力，认知复杂度评估了以下方面的结构增量：

- 循环：`for, while, do while, ...`
- 条件：`三元运算符、if, #if, #ifdef, ...`

评估混合增量：

- `else if, elif, else, …`

它没有评估这些结构的嵌套增量，因为在阅读`if`时已经计算了认知成本。（No nesting increment is assessed for these structures because the mental cost has already been paid when reading the if.）

对于习惯了圈复杂度的人来说，这些增量目标似乎很熟悉。此外，认知复杂度也会增加：

**Catches**：

`catch`和`if`一样代表控制流中的一种分支。因此，每个`catch`子句都会导致认知复杂度的增加。请注意，无论`catch`到多少异常，`catch`都只会为认知复杂度增加 1 分。`try`和`finally`块被完全忽略。

**Switches**：

一个`switch`和它所有的`case`组合在一起会产生一个单一的结构增量。

在圈复杂度下，`switch`被视为`if-else if 链`的模拟。也就是说，`switch`中的每种情况都会导致增量，因为它会导致控制流的数学模型中出现分支。

但是从维护者的角度来看，一个`switch` —— 将单个变量与一组明确命名的文字值进行比较 —— 比 `if-else if 链`更容易理解，因为后者可以使用任意数量的变量和值进行任意数量的比较。

简而言之，`if-else if 链`（结构的代码）必须仔细阅读，而`switch`通常可以一目了然。

**Sequences of logical operators（逻辑运算符序列）**：

出于类似的原因，认知复杂度不会因每个二元逻辑运算符而增加。相反，它评估每个二元逻辑运算符序列的基本增量。 例如：

```java
// 示例1：
a && b
a && b && c && d

// 示例2：
a || b
a || b || c || d
```

理解上述 2 个示例中的第二行并不比理解第一行难。 另一方面，理解以下两行却有显着差异：

```java
a && b && c && d
a || b && c || d
```

因为混合运算符使布尔表达式变得更加难以理解，因此对于类似运算符的每个新序列，认知复杂度都会增加。 例如：

```java
if (a         // +1 for `if`
  && b && c   // +1
  || d || e   // +1
  && f)       // +1

if (a         // +1 for `if`
  &&          // +1
  !(b && c))  // +1
```

虽然认知复杂度为相对于圈复杂度的类似运算符提供了“折扣”，但它确实会增加所有二进制布尔运算符序列，例如变量赋值、方法调用和返回语句中的运算符。

**Recursion（递归）**：

与圈复杂度不同，无论是直接的还是间接的，认知复杂度为递归循环中的每个方法添加一个基本增量。 这个决定有两个动机。 首先，递归代表一种“元循环”，并且循环的认知复杂度递增。其次，认知复杂度是关于估计理解一个方法的控制流的相对难度，甚至一些经验丰富的程序员也发现递归难以理解。

**Jumps to labels（跳转标签）**：

`goto`为认知复杂度添加了一个基本增量，就像`break`或`continue`到标签和其他多级跳转，例如`break`或`continue`到某些语言中的数字。但是因为提前返回通常可以使代码更清晰，所以其他跳转或提前退出不会导致增量。

## 嵌套断流结构的增量（Increment for nested flow-break structures）

从直觉上看，五个 if 和 for 结构的线性系列比连续嵌套的五个相同的结构更容易理解，无论通过每个系列的执行路径的数量如何。 由于这种嵌套增加了理解代码的心理需求，因此认知复杂度评估了它的嵌套增量。

具体来说，每次导致结构或混合增量的结构嵌套在另一个这样的结构中时，每个嵌套级别都会添加一个嵌套增量。例如，在以下示例中，方法本身或`try`没有嵌套增量，因为这两种结构都不会导致结构性增量或混合增量：

```java
void myMethod () {
  try {
    if (condition1) { // +1
      for (int i = 0; i < 10; i++) { // +2 (nesting=1)
        while (condition2) { … } // +3 (nesting=2)
      }
    }
  } catch (ExcepType1 | ExcepType2 e) { // +1
    if (condition2) { … } // +2 (nesting=1)
  }
} // Cognitive Complexity 9
```

但是，`if、for、while 和 catch`结构都受结构和嵌套增量的影响。

此外，虽然顶级方法被忽略，并且 lambdas、嵌套方法和类似功能没有结构增量，但当嵌套在其他类似方法的结构中时，这些方法确实会增加嵌套级别：

```java
void myMethod2 () {
  Runnable r = () -> { // +0 (but nesting level is now 1)
    if (condition1) { … } // +2 (nesting=1)
  };
} // Cognitive Complexity 2


#if DEBUG // +1 for if
void myMethod2 () { // +0 (nesting level is still 0)
  Runnable r = () -> { // +0 (but nesting level is now 1)
    if (condition1) { … } // +3 (nesting=2)
  };
} // Cognitive Complexity 4
#endif
```

## 影响

制定认知复杂度的主要目标是计算更准确地反映方法的相对可理解性的方法分数，其次要目标是解决现代语言结构并产生在方法层面上有价值的指标。显然，解决现代语言结构的目标已经实现。下面检查另外两个目标。

### 直观的“正确”复杂度分数（Intuitively ‘right’ complexity scores）

这个讨论从一对具有相同圈复杂度但明显不同的可理解性的方法开始。 现在是时候重新检查这些方法并计算它们的认知复杂性分数了：

```java
int sumOfPrimes(int max) {
  int total = 0;
  OUT: for (int i = 1; i <= max; ++i) { // +1
    for (int j = 2; j < i; ++j) { // +2
      if (i % j == 0) { // +3
        continue OUT; // +1
      }
    }
    total += i;
  }
  return total;
} // Cognitive Complexity 7


String getWords(int number) {
  switch (number) { // +1
    case 1:
      return "one";
    case 2:
      return "a couple";
    case 3:
      return “a few”;
    default:
      return "lots";
  }
} // Cognitive Complexity 1
```

认知复杂度算法为这两种方法给出了明显不同的分数，这些分数更能反映它们的相对可理解性。

### 高于方法级别的有价值的指标（Metrics that are valuable above the method level）

此外，由于认知复杂度不会因方法结构而增加，因此聚合数字变得有用。现在，您可以通过简单地比较它们的度量值来区分域类（具有大量简单的`getter`和`setter`的类）和包含复杂控制流的类之间的区别。因此，认知复杂度成为衡量类和应用程序相对可理解性的工具。

## 总结（Conclusion）

编写和维护代码的过程是人工过程。它们的输出必须符合数学模型，但它们本身并不适合数学模型。这就是为什么数学模型不足以评估它们所需的努力。

认知复杂度打破了使用数学模型来评估软件可维护性的做法。它从**圈复杂度**设定的先例开始，但使用人类判断来评估应该如何计算结构，并决定应该将什么添加到整个模型中。因此，它产生的方法复杂性分数让程序员觉得比以前的模型更公平的可理解性相对评估。此外，由于认知复杂度不收取方法的“入门成本”，因此它不仅在方法级别，而且在类和应用程序级别都会产生更公平的相对评估。

> [1] Thomas J. McCabe, “A Complexity Measure”, IEEE Transactions on Software Engineering, Vol. SE-2, No. 4, December 1976

## 示例

一个 YUI 的 js 示例：

```js
save: function (options, callback) {
  var self = this;
  if (typeof options === 'function') {  // +1
    callback = options;
    options = {};
  }
  options || (options = {}); // +1
  self._validate(self.toJSON(), function (err) {
    if (err) { // +2 (nesting = 1)
      callback && callback.call(null, err); // +1
      return;
    }
    self.sync(
      self.isNew() ? 'create' : 'update', // +2 (nesting = 1)
      options,
      function (err, response) {
        var facade = {
            options: options,
            response: response,
          },
          parsed;
        if (err) { // +3 (nesting = 2)
          facade.error = err;
          facade.src = 'save';
          self.fire(EVT_ERROR, facade);
        } else { // +1
          if (!self._saveEvent) { // +4 (nesting = 3)
            self._saveEvent = self.publish(EVT_SAVE, {
              preventable: false,
            });
          }
          if (response) { // +4 (nesting = 3)
            parsed = facade.parsed = self._parse(response);
            self.setAttrs(parsed, options);
          }
          self.changed = {};
          self.fire(EVT_SAVE, facade);
        }
        callback && callback.apply(null, arguments); // +1
      }
    );
  });
  return self;
} // total complexity = 20
```

## 附录 A：Compensating Usages

> todo...

## 附录 B：Specification（标准）

本节的目的是简要列举增加认知复杂度的结构和情况，但附录 A 中列出的例外情况除外。这是一个全面的列表，而不是详尽无遗的。也就是说，如果一种语言对关键字有一个非典型的拼写，例如`elif`和`else if`，这里的省略并不是为了从规范中省略它。

### B1. 增量

以下各项都有一个增量：

- `if`, `else if`, `else`, `三元运算符`
- `switch`
- `for`, `foreach`
- `while`, `do while`
- `catch`
- `goto LABEL`, `break LABEL`, `continue LABEL`, `break NUMBER`, `continue NUMBER`
- 二元逻辑运算符序列（sequences of binary logical operators）
- 递归循环中的每个方法（each method in a recursion cycle）

### B2. 嵌套级别

以下结构增加嵌套级别：

- `if`, `else if`, `else`, `三元运算符`
- `switch`
- `for`, `foreach`
- `while`, `do while`
- `catch`
- 嵌套方法和类似方法的结构，例如`lambda`（nested methods and method-like structures such as lambdas）

### B3. 嵌套增量

以下结构接收与它们在 B2 结构内的嵌套深度相称的嵌套增量：

- `if`, `三元运算符`
- `switch`
- `for`, `foreach`
- `while`, `do while`
- `catch`
