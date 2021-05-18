---
title: Git工作流之集中式工作流
s: centralized_workflow
date: 2021-05-14 10:12:22
tags: git
---

对于从 SVN 过渡的团队来说，集中式工作流（Centralized Workflow）是一个很棒的 Git 工作流。与[Subversion](https://subversion.apache.org/)一样，集中式工作流使用中央仓库作为项目所有更改的单个入口点。类比 svn 的 trunk，它 **使用`master`作为默认的开发分支且所有提交操作都在该分支上。** 这种工作流除了`master`分支外，不需要任何其他分支。

集中式工作流在使用远程服务器端托管仓库方面与其他工作流类似，开发人员可以通过这种仓库推送（`push`）和拉取（`pull`）资源。

与其他工作流程相比，集中式工作流程没有定义的合并请求（`pull request`）或派生（`fork`）模式。**集中式工作流通常更适合从 SVN 迁移到 Git 的团队以及规模较小的团队。**

## 运作原理

### 初始化中央仓库

![初始化中央仓库](/uploads/post/init_central_repo.svg)

```bash
ssh user@host git init --bare /path/to/repo.git
```

一般我们将仓库托管到 git 仓库托管平台（如 Bitbucket、Gitlab），在托管平台上面初始化中央仓库。

### 克隆中央仓库

接下来，每个开发人员都将创建整个项目的本地副本。通过以下`git clone`命令完成的：

```bash
git clone ssh://user@host/path/to/repo.git
```

当 clone 一个仓库时，假设您要在以后与之进行进一步的交互，Git 会自动添加一个叫`origin`的快捷方式，并指向“父”仓库。

### 修改与提交

一旦在本地克隆了仓库，开发人员就可以使用标准的 Git 提交过程进行更改：编辑（edit），暂存（stage）和提交（commit）。

> 暂存：实际上就是我改了 3 个文件，但是我只想提交 2 个文件，就可以先`git add`将指定的 2 个文件暂存，然后使用`git commit`就只会提交暂存的那 2 个文件，这样便避免了提交非必要文件。

```bash
git status # 查看仓库状态
git add  # 暂存
git commit # 提交
```

请记住，由于这些命令创建了本地提交，小王可以根据需要多次重复此过程，而不必担心中央仓库中的情况。这对于需要分解为更简单，更原子的块的大型功能非常有用。

### 推送新提交到中央仓库

将本地更新推送到远程中央仓库中。

```bash
git push origin master
```

该命令会将本地新提交的更改推送到远程中央仓库。在此推送过程中可能出现一种特殊情况就是小丽（另一开发者）在小王之前推送过代码，此时 Git 将输出一条消息，指出此冲突。

冲突情况下，应该先执行 Git 拉取命令：

```bash
git pull
```

下一节将对此冲突情形进行扩展。

### 冲突管理

中央仓库代表官方项目，因此其提交历史应视为神圣且不可改变。如果开发人员的本地提交偏离中央仓库，则 Git 将拒绝推送其更改，因为这将覆盖官方提交。

![冲突管理](/uploads/post/man_conflicts.svg)

在开发人员发布功能之前，他们需要获取更新的中央提交并在其基础上重新进行更改。这就像在说：“我想将自己的更改添加到其他所有人已经完成的操作中。”与传统的 SVN 工作流程一样，结果是完美的线性历史记录。

如果本地更改直接与上游提交冲突，则 Git 将暂停变基过程（the rebasing process），并为您提供手动解决冲突的机会。关于 Git 的好处是，它使用相同的`git status`和`git add`命令来生成提交和解决合并冲突。这使新开发人员可以轻松管理自己的合并。另外，如果他们遇到麻烦，Git 可以很轻松地中止整个重新部署并重试（或寻求帮助）。

## 举例说明

让我们举一个例子，说明典型的小型团队如何使用此 Git 工作流进行协作。我们将看到`小王`和`小丽`这两个开发人员如何使用单独的功能并通过集中式仓库共享他们的贡献。

### 小王

![scfp_xw](/uploads/post/scfp_xw.svg)

在他的本地仓库中，`小王`可以使用标准的 Git 提交过程（编辑、暂存和提交）来开发功能。

```bash
git status # 查看仓库状态
git add  # 暂存
git commit # 提交
```

请记住，由于这些命令创建了本地提交，因此`小王`可以根据需要多次重复此过程，而不必担心中央仓库中的情况。

### 小丽

![scfp_xl](/uploads/post/scfp_xl.svg)

同时，`小丽`使用相同的（编辑、暂存和提交）过程在自己的本地仓库中开发自己的功能。像`小王`一样，她不在乎中央仓库中发生的事情，她也不用在乎`小王`在其本地仓库中正在做什么，因为所有本地仓库都是私有的。

### 小王发布他完成的功能

![pf_xw](/uploads/post/pf_xw.svg)

`小王`完成其功能后，应将其本地提交发布到中央仓库，以便其他团队成员可以访问它。他可以使用`git push`命令执行此操作，如下所示：

```bash
git push origin master
```

请记住，`源（origin）`是与`小王`克隆 Git 仓库时创建的中央仓库的远程连接。`master`参数告诉 Git 尝试使`源（origin）的master分支`对照`本地的master分支`。由于`小王`克隆以来中央仓库尚未更新，因此不会造成任何冲突，并且推送将按预期进行。

### 小丽尝试发布她完成的功能

![pce_xl](/uploads/post/pce_xl.svg)

让我们看看如果`小王`成功将其更改发布到中央仓库后`小丽`尝试发布其功能，会发生什么情况。她可以使用完全相同的`push`命令：

```bash
git push origin master
```

但是，由于她的本地历史与中央仓库有所不同，因此 Git 会以相当冗长的错误消息拒绝该请求：

```bash
error: failed to push some refs to '/path/to/repo.git'
hint: Updates were rejected because the tip of your current branch is behind
hint: its remote counterpart. Merge the remote changes (e.g. 'git pull')
hint: before pushing again.
hint: See the 'Note about fast-forwards' in 'git push --help' for details.
```

这样可以防止`小丽`覆盖正式提交。她需要将`小王`的更新放入仓库中，并将其与本地更改集成，然后重试。

### 小丽重新以小王的提交为基准

`小丽`可以使用`git pull`将上游更改合并到她的仓库中。这个命令有点像`svn update`-将整个上游提交历史记录拉到`小丽`的本地仓库中，并尝试将其与她的本地提交集成：

```bash
git pull --rebase origin master
```

`--rebase`选项告诉 Git 在将其与中央仓库中的更改同步后，将所有`小丽`的提交都移至 master 分支的末端，如下所示：

![rebase](/uploads/post/rebase.svg)

如果您忘记了此选项`--rebase`，`pull`仍然有效，但是每次有人需要与中央仓库同步时，您都会得到多余的“合并提交”。对于此工作流程，最好重新设置基准，而不是生成合并提交。

### 小丽解决合并冲突

![rc_xl](/uploads/post/rc_xl.svg)

变基（`rebase`）工作是通过将每个本地提交一次一个的转移到最新的（`master`）主分支。这意味着您可以逐个提交地解决合并冲突，而不是在一个大规模合并提交中解决所有冲突。这样可以使您的提交尽可能集中，并保证项目历史记录的整洁。反过来，这使得找出错误的位置变得容易得多，并且在必要时以对项目的影响最小的方式回滚更改。

如果`小丽`和`小王`正在开发不相关的功能，则重新定基过程不太可能产生冲突。但如果产生了冲突，Git 将在当前提交时暂停定基（rebase），并输出以下消息以及一些相关说明：

```bash
CONFLICT (content): Merge conflict in xxx
```

![conflict_resolution](/uploads/post/conflict_resolution.svg)

Git 的伟大之处在于，任何人都可以解决自己的合并冲突。在我们的示例中，`小丽`只需运行[git status](https://www.atlassian.com/git/tutorials/inspecting-a-repository/git-status)即可查看问题出在哪里。冲突的文件将显示在“未合并的路径”部分中：

```txt
# Unmerged paths:
# (use "git reset HEAD ..." to unstage)
# (use "git add/rm ..." as appropriate to mark resolution)
#
# both modified:
```

然后，她将根据自己的喜好编辑文件。对结果感到满意后，她可以按照常用的方式暂存文件（`git add`），然后让[git rebase](https://www.atlassian.com/git/tutorials/rewriting-history/git-rebase)完成其余工作：

```bash
git add
git rebase --continue # 合并冲突，结合 git add 命令一起用于修复冲突（fix conflicts and then run "git rebase --continue"）
```

以上就是一个提交的冲突处理的整个流程，Git 将继续进行下一个提交，并针对产生冲突的任何其他提交重复该过程。

当您（在冲突处理过程中）意识到感觉不对、不知道发生了什么时，不要惊慌，只需执行以下命令，您便会回到开始的位置：

```bash
git rebase --abort # 放弃合并，回到rebase操作之前的状态，之前的提交不会丢弃；
```

### 小丽成功发布已完成的功能

![scr_xl](/uploads/post/scr_xl.svg)

与中央仓库同步后，`小丽`将能够成功发布其更改：

```bash
git push origin master
```

## 总结

如您所见，仅使用少量 Git 命令即可复制传统的 Subversion 开发环境。这对于将团队从 SVN 过渡过来非常有用，但它没有利用 Git 的分布式特性。

集中式工作流程非常适合小型团队。当您的团队规模扩大时，上面详述的冲突解决过程可能会成为瓶颈。如果您的团队对集中式工作流程感到满意，但想简化其协作工作，那么绝对值得探索{% post_link Git工作流之功能分支工作流 %}。通过为每个功能指定一个独立的分支，可以在将新功能集成到正式项目中之前就新功能进行深入的讨论。

> [英文原文](https://www.atlassian.com/git/tutorials/comparing-workflows)
