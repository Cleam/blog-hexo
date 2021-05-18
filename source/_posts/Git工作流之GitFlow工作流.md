---
title: Git工作流之GitFlow工作流
date: 2021-05-17 15:12:15
tags: git
---

**GitFlow 工作流（GitFlow Workflow）**是一个 Git 工作流程，可帮助持续进行软件开发和实施 [DevOps](https://www.atlassian.com/devops/what-is-devops) 实践。它最初[由 Vincent Driessen 在 nive 上发行](http://nvie.com/posts/a-successful-git-branching-model/)并广受欢迎。Gitflow 工作流定义了围绕项目发行版设计的严格分支模型。这为管理**较大的项目**提供了一个强大的框架。

Gitflow 非常适合具有预定发布周期的项目以及[DevOps 连续交付](https://www.atlassian.com/continuous-delivery)的[最佳实践](https://www.atlassian.com/devops/what-is-devops/devops-best-practices)。此工作流程未添加《{% post_link Git工作流之功能分支工作流 %}》所需的任何新概念或命令。而是将非常具体的角色分配给不同的分支，并定义它们应如何以及何时进行交互。除了功能分支外，它还使用单独的分支来准备、维护和记录版本。当然，您还可以利用功能分支工作流（Feature Branch Workflow）的所有好处：合并请求、功能试验和更有效的协作。

## 入门

Gitflow 实际上只是 Git 工作流的抽象概念。这意味着它决定了要建立哪种分支以及如何将它们合并在一起。我们将触及以下分支的目的。 `git-flow工具集`是具有安装过程的实际命令行工具，安装过程很简单，git-flow 的软件包可在多个操作系统上使用。

- Mac OS: `brew install git-flow`
- Windows: [下载并安装 git-flow](https://git-scm.com/download/win)

安装 git-flow 后，您可以通过执行`git flow init`在项目中使用它。Git-flow 是基于 Git 的包装，`git flow init`命令是`git init`命令的扩展，除了为您创建分支外，不会更改仓库中的任何内容。

## 运作原理

![how it works](/uploads/post/gitflow_01.svg)

### develop 和 master 分支

该工作流使用两个分支而不是单个主（master）分支来记录项目的历史记录。master 分支存储正式的发行历史，而 develop 分支则充当功能的集成分支。使用版本号标记 master 分支中的所有提交也很方便。

第一步是用一个`develop分支`来补充默认的 master。一种简单的方法是让一个开发人员在本地创建一个空的 develop 分支并将其推送到服务器：

```bash
git branch develop
git push -u origin develop
```

该分支将包含项目的完整历史记录，而 master 将包含简化版本。现在，其他开发人员应该克隆中央仓库，并为`develop`创建跟踪分支。

使用 git-flow 扩展库时，在现有存储库上执行`git flow init`将创建`develop`分支：

```bash
$ git flow init


Initialized empty Git repository in ~/project/.git/
No branches exist yet. Base branches must be created now.
Branch name for production releases: [master]
Branch name for "next release" development: [develop]


How to name your supporting branch prefixes?
Feature branches? [feature/]
Release branches? [release/]
Hotfix branches? [hotfix/]
Support branches? [support/]
Version tag prefix? []


$ git branch
* develop
 master
```

## 功能分支（feature branches）

每个新功能应驻留在其自己的分支中，可以将其[推送到中央仓库](https://www.atlassian.com/git/tutorials/syncing/git-push)以进行备份与协作。但是，功能分支不是基于`master分支`，而是将`develop分支`用作其父分支。当功能开发完成后，它会重新合并到`develop分支`中。功能绝不能直接与`master分支`进行交互。

![feature branches](/uploads/post/gitflow_02.svg)

请注意，出于所有意图和目的，将`功能分支（feature branch）`与`开发分支（develop）`结合使用是**功能分支工作流**的处理方式。但是，**Gitflow 工作流**并不止于此。

通常创建`功能分支`是基于`最新的开发分支（develop）`。

### 创建一个功能分支

```bash
# 不使用git-flow 扩展工具方式：
git checkout develop
git checkout -b feature_branch

# 使用git-flow 扩展工具方式：
git flow feature start feature_branch
```

### 完成一个功能分支

完成功能开发工作后，下一步就是将`功能分支（feature branch）`合并到`开发分支（develop）`中。

```bash
# 不使用git-flow 扩展工具方式：
git checkout develop
git merge feature_branch

# 使用git-flow 扩展工具方式：
git flow feature finish feature_branch
```

## 发布分支（release branches）

![release branches](/uploads/post/gitflow_03.svg)

一旦`开发分支（develop）`获得了足够的功能以进行发布（或临近预定的发布日期），就可以从开发分支（develop）中`派生（fork）`一个`发布分支（release）`。创建此分支将开始下一个**发行周期**，因此此刻之后不能添加任何新功能-该分支中仅应包含错误修复、文档生成以及其他面向发行版的任务。一旦准备好发布，`发布分支`将合并到`master`并用版本号标记。此外，应该将其重新合并到开发分支（develop）中。

使用专门的分支来准备发布，使一个团队可以完善 ​​ 当前版本，而另一个团队可以继续开发下一个版本的功能。

<!-- 它还创建了明确定义的开发阶段（例如，很容易地说：“本周我们正在为版本 4.0 做准备，并且可以在存储库的结构中实际看到它）。” -->

创建`发布分支`是另一种直接的分支操作。像`功能分支`一样，发布分支也基于`开发分支`。可以使用以下方法创建新的`发布分支`。

```bash
# 不使用git-flow 扩展工具方式：
git checkout develop
git checkout -b release/0.1.0

# 使用git-flow 扩展工具方式：
$ git flow release start 0.1.0
Switched to a new branch 'release/0.1.0'
```

一旦`release分支`准备好发布，它将被合并到 master 中并进行开发，然后**发布分支将被删除**。重新合并到`develop分支`中很重要，因为关键更新可能已添加到 release 分支，并且新功能需要访问这些更新。如果您的团队要求`代码评审`，那么这将是提出发起`合并请求`的理想场所。

要完成`release分支`，请使用以下方法：

```bash
# 不使用git-flow 扩展工具方式：
git checkout master
git merge release/0.1.0

# 使用git-flow 扩展工具方式：
git flow release finish '0.1.0'
```

## 热修分支（hotfix branches）

![hotfix branches](/uploads/post/gitflow_04.svg)

维护或`热修分支（hotfix）`用于快速修补生产版本。热修分支（hotfix）与发布分支（release）以及功能（feature）分支很像，只是它们基于`master`而不是`develop`分支。这是唯一应直接基于`master`而创建的分支。修复完成后，应将其`合并到master和develop`（或当前 release 分支）中，并应使用`更新的版本号`标记 master。

拥有专用的错误修复开发线（hotfix 分支），您的团队可以在不中断其余工作流程或不等待下一个发布周期的情况下解决问题。您可以将`热修分支（hotfix）`视为直接与 master 一起使用的临时发布分支。可以使用以下方法创建热修分支：

```bash
# 不使用git-flow 扩展工具方式：
git checkout master
git checkout -b hotfix_branch

# 使用git-flow 扩展工具方式：
git flow hotfix start hotfix_branch
```

与完成发布分支相似，热修分支也`合并到master和develop`中。

```bash
# 不使用git-flow 扩展工具方式：
git checkout master
git merge hotfix_branch
git checkout develop
git merge hotfix_branch
git branch -D hotfix_branch

# 使用git-flow 扩展工具方式：
git flow hotfix finish hotfix_branch
```

## 示例

完整示例如下，假设我们有一个带有 master 分支的仓库。

```bash
git checkout master
git checkout -b develop
git checkout -b feature_branch
# work happens on feature branch 发生在功能分支的工作
git checkout develop
git merge feature_branch
git checkout master
git merge develop
git branch -d feature_branch
```

除了功能开发和发布流程外，`热修（hotfix）`示例如下：

```bash
git checkout master
git checkout -b hotfix_branch
# work is done commits are added to the hotfix_branch
git checkout develop
git merge hotfix_branch
git checkout master
git merge hotfix_branch
```

## 总结

在这里，我们讨论了 Gitflow 工作流。 Gitflow 是您和您的团队可以利用的多种《{% post_link Git工作流 %}》之一。

了解 Gitflow 的一些关键点：

- 该工作流程非常适合基于发行版的软件工作流程。
- Gitflow 为生产修复程序提供了专用渠道（热修分支）。

Gitflow 的总体流程为：

1. 一个基于`主分支（master）`创建的`开发分支（develop）`；
2. 一个基于开发分支创建的`发布分支（release）`;
3. `功能分支（feature branch）`基于开发分支创建；
4. 功能完成后，将其合并到开发分支中;
5. 完成发布分支后，将它`合并到master和develop`中；
6. 如果检测到`主分支（master）`出现问题，则会从主分支中创建一个`热修分支（hotfix）`;
7. 热修分支完成后，将它`合并到master和develop`中。

接下来，了解分《{% post_link Git工作流之派生工作流 %}》

> [英文原文](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow)
