---
title: docker镜像的导入和导出
date: 2021-12-21 17:21:54
tags:
  - docker
  - 运维
  - linux
---

## 背景介绍

在有些镜像包比较大，下载比较耗时的情况下，我们可以采用该方法，从一个网速（或代理）快的地方下载下来，再复制到其他地方去使用。

## 导出

```sh
docker save alpine:latest > ./alpine_latest.tar
```

## 远程复制

```sh
# 指定端口号复制
scp -P <端口号> ./alpine_latest.tar root@xx.xx.xx.xx:/data/xxx 

# 指定ssh秘钥复制
scp -i "/Users/admin/.ssh/xxx" * ubuntu@xx.xxx.xxx.xxx:/home/ubuntu/xxx
```

## 导入

```sh
docker load < ./alpine_latest.tar
# or
docker load --input ./alpine_latest.tar
```
