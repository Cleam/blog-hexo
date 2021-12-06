---
title: centos下的docker安装与升级
date: 2021-12-06 10:00:58
tags:
  - docker
  - 运维
---

## 前提条件

1. 操作系统要求：`centos >= 7`
2. 卸载旧版本：

```sh
sudo yum remove docker \
                  docker-client \
                  docker-client-latest \
                  docker-common \
                  docker-latest \
                  docker-latest-logrotate \
                  docker-logrotate \
                  docker-engine
```

## 安装

安装有多种方式，我们采用存储库（repository）方式进行安装（方便日后进行更新升级），这也是官方推荐的安装方式。

### 配置安装源

在安装之前，需要先配置安装源：

- 官方：https://download.docker.com/linux/centos/docker-ce.repo
- 阿里云：http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo

```sh
sudo yum install -y yum-utils

sudo yum-config-manager \
    --add-repo \
    http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
```

### 正式安装

1. 如果对版本没要求，直接安装latest版本：

```sh
sudo yum install docker-ce docker-ce-cli containerd.io
```

2. 如果需要安装指定版本，先列出可用版本，然后再选择安装：

```sh
yum list docker-ce --showduplicates | sort -r

# docker-ce.x86_64            3:20.10.9-3.el7                    docker-ce-stable
# docker-ce.x86_64            3:20.10.8-3.el7                    docker-ce-stable
# docker-ce.x86_64            3:20.10.7-3.el7                    docker-ce-stable
# ...
```

指定版本安装

```sh
sudo yum install docker-ce-<VERSION_STRING> docker-ce-cli-<VERSION_STRING> containerd.io
```

3. 启动docker

```sh
sudo systemctl start docker
```

4. 通过运行一个`hello-world`镜像来校验docker是否安装正确

```sh
sudo docker run hello-world
```

## 升级docker

升级和安装是一样的步骤，只是选择不同的版本进行安装，请先执行[前提条件](#前提条件)。

## 参考

[官方英文原文](https://docs.docker.com/engine/install/centos/)
