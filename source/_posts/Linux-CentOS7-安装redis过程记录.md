---
title: Linux（CentOS 7）安装redis过程记录
date: 2020-12-10 17:21:49
tags: 运维
---

> 前两步非必须，因为我的系统是新的，所以需要做一些配置和更新。

## 一、查看系统版本信息

```bash
# 查看系统信息
cat /proc/version
# Linux version 3.10.0-229.20.1.el7.x86_64 (builder@kbuilder.dev.centos.org) (gcc version 4.8.3 20140911 (Red Hat 4.8.3-9) (GCC) )

# 查看版本
cat /etc/redhat-release # CentOS Linux release 7.9.2009 (Core)
```

## 二、修改 yum 安装源

使用国内源，安装更新包更快。我直接按照[阿里云 CentOS 镜像](https://developer.aliyun.com/mirror/centos?spm=a2c6h.13651102.0.0.3e221b11ClmKNM)的操作。

## 三、安装 redis

可以到[这里](https://redis.io/download)找到最新下载地址：
![redis下载](/uploads/post/redis.png)

```bash
# 下载
wget https://download.redis.io/releases/redis-6.0.9.tar.gz
# 解压
tar xzf redis-6.0.9.tar.gz
# 进入redis项目
cd redis-6.0.9
# 编译
make
```

### 错误 1：`zmalloc.h:50:10: 致命错误：jemalloc/jemalloc.h：没有那个文件或目录`

解决方法：

```bash
# 在`make`之前，先编译依赖
make persist-settings

# 然后再运行make
make install
# 默认安装到目录“/usr/local”，如果需要安装到其它目录，可指定 make 的参数“PREFIX”，如：
make install PREFIX=/usr/local/redis
```

### 错误 2：`server.c:1032:31: 错误：‘struct redisServer’没有名为‘logfile’的成员`

解决方法：升级依赖

```bash
yum -y install centos-release-scl devtoolset-9-gcc devtoolset-9-gcc-c++ devtoolset-9-binutils

scl enable devtoolset-9 bash

# 以上为临时启用，如果要长期使用gcc 9.1的话：
echo "source /opt/rh/devtoolset-9/enable" >> /etc/profile
```

## 三、运行

我的 redis 安装在`/opt/`目录下：

```bash
# 启动redis
/opt/redis-6.0.9/src/redis-server /opt/redis-6.0.9/redis.conf
```

## 四、修改为后台启动

编辑配置文件 `redis.conf`

```bash
vim /opt/redis-6.0.9/redis.conf
```

将`daemonize no`修改为`daemonize yes`，保存之后，重新启动。

## 五、参考

- https://developer.aliyun.com/mirror/centos?spm=a2c6h.13651102.0.0.3e221b11ClmKNM
- https://redis.io/download
- https://www.cnblogs.com/aquester/p/13581147.html
- https://www.cnblogs.com/shook/p/12883742.html
