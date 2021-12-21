---
title: '一次docker容器和宿主机网络不通问题记录'
date: 2021-12-08 18:21:11
tags:
 - linux
 - 运维
 - docker
---

## 背景

准备往docker容器中新增一个服务Z，但是服务Z对docker以及docker-compose版本要求较高，所以决定做一次升级。

## 升级

简单看了下系统参数：

```sh
$ uname -r
# 3.10.0-327.22.2.el7.x86_64

$ uname -a 
# Linux 10-42-1-77 3.10.0-327.22.2.el7.x86_64 #1 SMP Thu Jun 23 17:05:11 UTC 2016 x86_64 x86_64 x86_64 GNU/Linux

$ cat /etc/redhat-release
# CentOS Linux release 7.2.1511 (Core)
```

貌似可以支持升级docker。

于是我首先运行了`yum update` 或者 `yum upgrade`（具体是哪个，我不记得了。这中间可能有error，当时没在意，起初我也不知道update和upgrade的区别）。

[yum update和yum upgrade的真正区别](https://cloud.tencent.com/developer/article/1604418)：“yum update和yum upgrade的功能都是一样的，都是将需要更新的package更新到源中的最新版。唯一不同的是，yum upgrade会删除旧版本的package，而yum update则会保留(obsoletes=0)。生产环境中建议使用yum update，防止因为替换，导致旧的软件包依赖出现问题。”

然后按照[docker官网教程](https://docs.docker.com/engine/install/centos/)升级了docker到版本：

```sh
$ docker --version
# Docker version 20.10.11, build dea9396
```

按照[教程](https://docs.docker.com/compose/install/#upgrading)升级了docker-compose到版本：

```sh
$ docker-compose --version
# docker-compose version 1.29.2, build 5becea4c
```

## 出现问题

一切顺利，兴高采烈的去将所有之前的docker服务运行起来，运行也一切正常，无任何报错。

但是，发现所有服务连不上了（我用的nginx做反向代理，转发请求道docker服务的），当时就很纳闷。

于是找运维帮忙排查，经过一阵子折腾，发现docker IP和宿主机IP有冲突了，于是就修改docker网段，改完之后现象和之前一样，服务能正常启动，就是连不上。于是一个一个排查：

- 关闭防火墙`systemctl stop firewalld`
- IP没有冲突
- docker服务正常
- nginx服务正常
- 路由正常
- ...

最终发现几个问题：

- 宿主机无法ping通容器IP
- 容器也无法ping通宿主机IP
- 容器无法ping通docker0（Docker 服务默认会创建一个 docker0 网桥（其上有一个 docker0 内部接口），它在内核层连通了其他的物理或虚拟网卡，这就将所有容器和本地主机都放到同一个物理网络）
- 容器可以ping通另一个容器

## 解决问题

经过2天问题的排查，直到找到[这篇文章](https://blog.csdn.net/qq_36059826/article/details/106550332)，接着找到[这篇文章](https://blog.csdn.net/weixin_42288415/article/details/105366176)。

应该能够确定问题：docker 加载内核的bridge.ko 驱动异常，导致docker0 网卡无法转发数据包，也就是系统内核的网桥模块bridge.ko 加载失败导致的，一般情况下这种场景的确很少见。

根据网上的说法是升级内核解决，于是我打算[升级内核](https://www.cnblogs.com/xzkzzz/p/9627658.html)，运行：`yum update`，发现error：

```sh
Error: initscripts conflicts with centos-release-7-2.1511.el7.centos.2.10.x86_64
 You could try using --skip-broken to work around the problem
 You could try running: rpm -Va --nofiles --nodigest
```

于是又网上查找[答案](https://blog.csdn.net/qq_40928073/article/details/84964782)，发现是yum的配置文件里面禁止更新内核：

```sh
$ cat /etc/yum.conf
# 里面有这么一行：
exclude=centos-release*
```

于是我注释掉排除升级内核的那一行，继续更新yum源仓库`yum update`就没有报错了：

```sh
...
Installed:
  kernel.x86_64 0:3.10.0-1160.49.1.el7

Dependency Installed:
  bc.x86_64 0:1.06.95-13.el7

Updated:
  centos-release.x86_64 0:7-9.2009.1.el7.centos              initscripts.x86_64 0:9.49.53-1.el7_9.1

Complete!
```

接下来就是按照[这篇文章](https://www.cnblogs.com/xzkzzz/p/9627658.html)一步步操作升级内核。

升级完成，重启之后，发现yum报错：

```sh
Cannot open logfile /var/log/yum.log
...
[Errno 30] Read-only file system: '/var/cache/yum/x86_64/7/runner_gitlab-runner/repomd.xml.old.tmp'
```

解决方法[将文件系统重新挂载为读/写](https://qastack.cn/ubuntu/175739/how-do-i-remount-a-filesystem-as-read-write)：`mount -o remount, rw /`，注意“,”和“rw”之间有一个空格。

## 最终结果

```sh
# 使用 alpine 镜像创建一个容器，并进入容器
docker run -it --name altest alpine sh

# 从容器内 ping 宿主机ip
ping 10.xx.xx.77 -c 3

PING 10.xx.xx.77 (10.xx.xx.77): 56 data bytes
64 bytes from 10.xx.xx.77: seq=0 ttl=64 time=0.102 ms
64 bytes from 10.xx.xx.77: seq=1 ttl=64 time=0.097 ms
64 bytes from 10.xx.xx.77: seq=2 ttl=64 time=0.119 ms

--- 10.xx.xx.77 ping statistics ---
3 packets transmitted, 3 packets received, 0% packet loss
round-trip min/avg/max = 0.097/0.106/0.119 ms

# docker0 ip
ifconfig docker0 | grep inet
        inet 172.17.0.1  netmask 255.255.0.0  broadcast 172.17.255.255

# ping docker0 也是ok的
ping 172.117.0.1 -c 1

PING 172.117.0.1 (172.117.0.1): 56 data bytes
64 bytes from 172.117.0.1: seq=0 ttl=236 time=173.943 ms

--- 172.117.0.1 ping statistics ---
1 packets transmitted, 1 packets received, 0% packet loss
round-trip min/avg/max = 173.943/173.943/173.943 ms
```

终于网络问题解决了😄。

## 最后

为了避免IP冲突，最后又重新[参考这里](https://cloud.tencent.com/developer/article/1470937)修改了docker网段。

```json
{
  // "default-address-pools": [{
  //    "base": "192.169.0.1/16",
  //    "size": 24
  //  }],
  "bip":"192.168.0.1/24",
  "data-root": "/data/docker",
  "registry-mirrors": ["https://xxxxx.mirror.aliyuncs.com"]
}
```

> 关于Docker的阿里云镜像加速，可以到[这里查看](https://cr.console.aliyun.com/cn-hangzhou/instances/mirrors)（需登录账号），也可以看看[这篇文章](https://developer.aliyun.com/article/29941)。

## 总结

问题是解决了，但是作为一个前端的我来说，还是有太多知识盲区，期间遇到了太多阻碍，不过解决之后很踏实，对网络、子网掩码有了更深的认识；对docker的认识也更加深刻。

在排查问题期间发现了一些好问题好文章：

- [Docker Bridge Conflicts with Host Network](https://stackoverflow.com/questions/50514275/docker-bridge-conflicts-with-host-network/52374482)
- [Configuring Docker to not use the 172.17.0.0 range](https://serverfault.com/questions/916941/configuring-docker-to-not-use-the-172-17-0-0-range/942176)
- [Docker容器跨主机通信之：直接路由方式](https://www.cnblogs.com/xiao987334176/p/10049844.html)
- [配置 docker0 网桥](https://yeasy.gitbook.io/docker_practice/advanced_network/docker0)
