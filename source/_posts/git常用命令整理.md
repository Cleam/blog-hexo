---
title: git常用操作整理
date: 2021-10-15 11:35:05
tags:
  - git
---

## 从远程仓库克隆指定 tag 代码

**常规操作**：

```sh
# 从远程克隆
$ git clone <repository> .

# 切换到指定tag
$ git checkout tags/<tagname>
```

注意，这将使存储库处于“分离头”状态。这意味着在此状态下所做的任何提交都不会影响任何分支。如果需要，可以使用-b 选项创建新分支：

```sh
# 切换到指定tag并新建分支
$ git checkout tags/<tagname> -b <branchname>
```

**快捷操作**：克隆的时候添加`-b`参数指定 tag 即可。

```sh
$ git clone -b <tagname> <repository> .
```

但有时候项目过大，我们为了避免拉取（fetch）所有分支到本地，加上参数：`–-single-branch`，只拉取当前分支代码：

```sh
$ git clone -b <tagname> –single-branch <repository> .
```

如果我们只需要最后 1 条记录的话，可以使拉取（fetch）的数据量更小，加参数：`--depth 1`（该参数默认就是`–-single-branch`）

```sh
$ git clone -b <tagname> –depth 1 <repository> .
```

> 参考：[Clone a specific tag with Git](https://www.techiedelight.com/clone-specific-tag-with-git/)
