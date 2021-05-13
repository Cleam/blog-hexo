---
title: npm peerDependencies
date: 2021-05-13 10:06:35
tags: 翻译,npm
---

> 希望通过此文阐明当你要使用 npm 的时候知道什么是`npm peerDependencies`，弄明白什么时候以及为什么使用它。
> `peerDependencies`（翻译：“同行依赖”或“对等依赖”）是`package.json`文件中的`peerDependencies`属性对象（列表）。
> 为了更好的理解此文，你至少要先了解[npm](https://www.npmjs.com/)

本文内容：

1. 首先，我们将准确比较`dependencies`与`peerDependencies`的工作方式。
2. 其次，我们将看到一些`dependencies`与`peerDependencies`的示例。
3. 然后，我们将研究 npm 如何处理版本冲突。
4. 最后，通过上面的基础铺垫，我们将看看如何合理的使用`peerDependencies`。

## 设想

为了保持真实性，假设您正在创建一个 Angular 库，甚至只是一个简单的 JavaScript 文件，其中导出了一些功能（函数）。

您的项目依赖于[npm Registry](https://www.npmjs.com/)中的软件包，这些软件包是您项目的`dependencies`依赖项。

你想从你的项目中创建你自己的 npm 包，所以你使用`npm pack`生成了一个 npm 包，你甚至想将它发布到[npm Registry](https://www.npmjs.com/)中。

团队中其他人想在他们项目中使用你的 npm 包作为他们项目的依赖。你在`package.json`使用`dependencies`和`peerDependencies`来告诉使用你的 npm 包的其他项目，要使你的 npm 包正常工作，则`dependencies`和`peerDependencies`中列出的包也需要安装。

因此，在最基本的层次上，这是`dependencies`与`peerDependencies`的工作方式：

### Dependencies

`Dependencies`是`package.json`文件中的[dependencies](https://docs.npmjs.com/files/package.json#dependencies)对象，当你添加一个 npm 包到`dependencies`对象中时，仿佛在说：

- 我的代码需要这个包才能运行。
- 如果该 npm 包在我的`node_modules`目录中尚不存在，请自动添加。
- 此外，添加`dependencies`中列出的 npm 包，这些 npm 包称为依赖项（`transitive dependencies`）。

### peerDependencies

`peerDependencies`是`package.json`文件中的[peerDependencies](https://docs.npmjs.com/files/package.json#peerdependencies)对象，当你添加一个 npm 包到`peerDependencies`对象中时，仿佛在说：

- 我的代码与此版本的 npm 包兼容。
- 如果此 npm 包已存在于`node_modules`中，则什么也不用做。
- 如果该软件包在`node_modules`目录中尚不存在或版本错误，请不要添加它。但是，需要向用户提示未找到该 npm 包的警告。

## 添加依赖

### 添加 dependencies

依赖包是我们使我们项目能够正常运行的一个 npm 包，通常作为`dependencies`添加的一些受欢迎的程序包有[lodash](https://www.npmjs.com/package/lodash)、[request](https://www.npmjs.com/package/request)和[moment](https://www.npmjs.com/package/moment)等等。

我们添加一个常规依赖项，如下所示：

```bash
npm install lodash
```

npm 将包名称和版本添加到我们项目的 package.json 文件中的`dependencies`对象中：

```js
"dependencies": {
  "lodash": "^4.17.11"
}
```

你们中的有些人可能还记得过去，我们不得不使用`--save`标志来更新 package.json 中的依赖项。值得庆幸的是，我们不再需要这样做了。

### 添加 peerDependencies

同行依赖包（`peerDependencies`）用于指定我们的程序包与 npm 程序包的特定版本兼容，[Angular](https://angular.io/)和[React](https://reactjs.org/)就是很好的例子。

要添加`peerDependencies`，您实际上需要手动修改`package.json`文件。例如，对于 Angular 组件库项目，我建议添加`angular/core`作为`peerDependencies`。因此，如果您想指定您的程序包是为 Angular 7 构建的，则可以包含以下内容：

```js
"peerDependencies": {
  "@angular/core": "^7.0.0"
}
```

## 关于冲突

我对某个 npm 包应该进入`dependencies`还是进入`peerDependencies`提出了很多疑问，做出此决定的关键在于了解 npm 如何处理版本冲突。

### 冲突测试

首先，我们创建一个简单的测试项目：`conflict-test`

我是这样创建的：

```bash
md conflict-test
cd conflict-test
npm init -y
```

然后，我手动编辑`package.json`文件并添加了两个依赖项：

```js
"dependencies": {
  "todd-a": "^1.0.0",
  "todd-b": "^1.0.0"
}
```

这两个`todd-a`和`todd-b`软件包也具有它们自己的依赖项：

```js
// todd-a:
"dependencies": {
  "lodash": "^4.17.11",
  "todd-child": "^1.0.0"
}

// todd-b:
"dependencies": {
  "lodash": "^4.17.11",
  "todd-child": "^2.0.0"
}
```

我想让您注意的是，`todd-a`和`todd-b`使用的是`lodash`的相同版本。但是，它们对于`todd-child`有版本冲突：

- `todd-a`使用`todd-child`版本`1.0.0`
- `todd-b`使用`todd-child`版本`2.0.0`

现在我知道，像我一样，您非常感兴趣，看看 npm 如何处理此版本冲突。在我的项目`conflict-test`中运行`npm install`，就像我们期望的那样，npm 在我们的`node_modules`文件夹中神奇地安装了`todd-a`和`todd-b`软件包。它还添加了它们所依赖的程序包（`transitive dependencies`）。因此，在运行`npm install`之后，我们来看一下`node_modules`文件夹。看起来像这样：

```bash
node_modules
├── lodash 4.17.11
├── todd-a 1.0.0
├── todd-b 1.0.0
│   └── node_modules
│       └── todd-child 2.0.0
└── todd-child 1.0.0
```

有趣的是，我们的项目有一个`lodash`副本。但是，它有两个`todd-child`副本。请注意，`todd-b`获得了其自己的`todd-child 2.0.0`的专用副本。

因此：

> npm 通过添加有冲突的程序包的重复私有版本来处理版本冲突。

### peerDependencies

从我们对 npm 版本冲突的实验中可以看出，如果将软件包添加到依赖项中，则有可能最终将其复制到`node_modules`中。

有时，具有相同软件包的两个版本也可以。但是，在同一代码库中有两个不同版本的某些程序包会导致冲突。

例如，假设我们的组件库是使用`Angular 5`创建的。当有人将其添加为`Angular 6`应用的依赖项时，我们不希望我们的程序包添加另一个完全不同的`angular/core`版本。

关键是：当该程序包可能与现有版本冲突并导致问题时，我们不希望我们的库添加另一个版本的程序包到`node-modules`。

**选择`peerDependencies`还是`dependencies`？**

当我的程序包依赖于另一个程序包时，应该将其放在`dependencies`还是`peerDependencies`中？

好吧，就像大多数技术问题一样：看情况。

`peerDependencies`表示兼容性。例如，您将希望具体说明您的库与哪个版本的`Angular`兼容。

### 指导方案

当满足以下条件之一时，建议使用`peerDependencies`：

- 多个依赖包可能会导致冲突
- 依赖关系清晰明了
- 您希望开发人员决定要安装哪个版本

让我们以`angular/core`为例。显然，如果您正在创建 Angular Library，则`angular/core`将成为您的库界面中非常明显的一部分。因此，它属于`peerDependencies`。

但是，也许您的库在内部使用`Moment.js`来处理一些与时间相关的输入，`Moment.js`很可能不会在 Angular Services 或组件的界面中公开。因此，它属于`dependencies`。

### Angular 作为依赖

假设您要在文档中指定您的库是一组 Angular 组件和服务，您可能会问以下问题：

> 我是否甚至需要将`angular/core`指定为依赖项？如果有人在使用我的库，他们将已经有一个现有的 Angular 项目。

好问题！

是的，我们通常可以假设对于我们特定于 Angular 的库，Workspace 将已经有可用的 Angular 软件包。因此，从技术上讲，我们无需费心将它们添加到我们的依赖项列表中。

但是，我们确实想告诉开发人员我们的库与哪些 Angular 版本兼容。因此，我建议采用以下方法：

至少为`peerDependencies`添加兼容的 Angular 版本的`angular/core`。

这样，如果开发人员尝试在其 Angular 6 项目中使用 Angular 7 库，则会看到警告。不必添加其他 Angular 软件包。您可以假定它们是否具有`angular/core`，是否具有其他 Angular 库。

## 总结

如有疑问，您可能应该倾向于使用`peerDependencies`。这样，您的软件包的用户就可以选择添加哪些软件包。

> 英文原文：[https://indepth.dev/posts/1187/npm-peer-dependencies](https://indepth.dev/posts/1187/npm-peer-dependencies)
