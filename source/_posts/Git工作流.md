---
title: Git工作流
date: 2021-05-13 16:10:10
tags:
  - git
  - 翻译
---

Git 工作流程是有关如何使用 Git 以一致且富有成效的方式完成工作的秘诀或建议。Git 工作流程鼓励用户有效，一致地利用 Git。

Git 在用户管理变更方面提供了很大的灵活性，鉴于 Git 对灵活性的关注，没有关于如何与 Git 交互的标准化流程。所以 `与团队合作进行 Git 管理的项目时，重要的是要确保团队就如何应用变更流程达成一致。` 为确保团队在同一页面上，应开发或选择一个已达成共识的 Git 工作流程。

## 什么是成功的 Git 工作流？

在为团队评估工作流时，最重要的是要考虑团队的文化。您希望工作流能够提高团队的效率，而不是限制生产力的负担。评估 Git 工作流程时应考虑以下几点：

- 此工作流程是否随团队规模扩展？
- 使用此工作流程是否容易减少犯错和错误？
- 此工作流程是否会给团队带来新的不必要的认知开销？

## 软件团队常见 Git 工作流

- 集中式工作流（Centralized Workflow）
- 功能分支工作流（Feature Branch Workflow）
- GitFlow 工作流（GitFlow Workflow）
- 派生工作流（Forking Workflow）

![Centralized Workflow](/uploads/post/wf_Centralized.jpg)
![Feature Branch Workflow](/uploads/post/wf_FeatureBranch.jpg)
![GitFlow Workflow](/uploads/post/wf_GitFlow.jpg)
![Forking Workflow](/uploads/post/wf_Forking.jpg)

至于团队应该使用哪种工作流，这要取决于团队具体情况来定。**最好的不一定好，最适合的才最好**，不同团队有不同的工作流。像我们团队采用的工作流并非上面 4 选 1，而是结合（功能分支、派生工作流）起来形成了适合自己的工作流。

> [英文原文](https://www.atlassian.com/git/tutorials/comparing-workflows)
