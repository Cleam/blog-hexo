---
title: shell常用操作整理
date: 2021-10-15 15:21:38
tags:
  - 运维
  - shell
---

## shell 中给变量设置默认值

正常操作：

```sh
if [ ! $1 ]; then
  VAR='default'
fi
```

优雅简洁操作：

```sh
# 当变量a为null时则var=b
var=${a-b}

# 当变量a为null或为空字符串时则var=b
var=${a:-b}

# 当参数1未传或传了空字符串时则变量VAR为默认值 default
VAR=${1:-default}
```
