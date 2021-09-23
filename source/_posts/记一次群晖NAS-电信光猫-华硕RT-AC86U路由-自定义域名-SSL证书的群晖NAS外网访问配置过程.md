---
title: 记一次群晖NAS+电信光猫+华硕RT-AC86U路由+自定义域名+SSL证书的群晖NAS外网访问配置过程
date: 2020-10-25 16:31:12
tags: 运维
---

自己买了一台群晖 NAS，一直想用自己购买的域名访问，虽然群晖官方提供了[quickconnect](http://www.quickconnect.to/)，但我经常出现访问不了的情况，所以最终还是决定自己折腾，折腾了很久，终于算是大功告成了。

我的设备：

1. 群晖 DS218+
2. 电信光猫
3. 华硕 RT-AC86U 路由器

大致思路：

1. 将光猫改成桥接模式，申请公网 IP（打 10000 修改、申请）
2. 路由器拨号联网（打 10000 获取账号密码）
3. 路由器配置端口转发
4. 用自己申请的域名绑定到公网 IP
5. 申请免费 SSL 证书，导入到群晖

## 光猫改桥接+申请公网 IP

- 方法一（推荐）：打 10000，将电信光猫改成桥接模式，并申请公网 IP。
- 方法二：也可以看[这篇文章](https://post.smzdm.com/p/aoo8klv6/)或[这篇文章](https://www.jianshu.com/p/ee61b0b58854)的教程获取到超级管理员账号，然后登陆进去改路由器为桥接模式。教程大概就是：

1. 使用光猫背面的（普通用户）账号密码登录进光猫，然后访问链接`http://192.168.1.1/backupsettings.conf`下载光猫的配置文件；
2. `backupsettings.conf`配置文件中就包含了超级管理员`telecomadmin`的密码（可以搜索 password 查看到），宽带账号密码也在里面（搜 username）。

![telecomadmin](/uploads/post/telecomadmin.png)
![username](/uploads/post/username.png)

有了这些信息，光猫就可以自己修改了，不过我也折腾了很久，才将桥接改成功，并且路由器拨号上网也没问题了，当时遇到一个问题就是路由器 WAN IP 和百度搜索到的外网 IP 不一致，我以为自己没有公网 IP，所以后面又还原回去了，就打 10000 让电信师傅来帮忙弄了，电信师傅来弄的时候，最后也是一样的结果，路由器上 WAN IP 和百度上显示的外网 IP 不一致 😓（因为这是验证是否有公网 IP 的方法）：

- 路由器 IP：![路由器IP](/uploads/post/WANIP.png)
- IP138 获取的 IP：![IP138获取的IP](/uploads/post/IP138IP.png)

最终电信师傅回去之后微信告诉我，重启路由器就行了。重启路由后，果然成功了 😂。

## 路由器拨号上网+端口转发

桥接改好了，公网 IP 也有了，接下来就是路由器拨号上网、配置端口转发，登录路由器管理页面，然后找到外部网络 WAN：

- 路由器拨号上网：![路由器拨号上网](/uploads/post/router_pppoe.png)
- 端口转发配置：![端口转发配置](/uploads/post/config_transform_port.png)

## 域名解析 + 免费 SSL 证书申请 + SSL 证书导入到群晖

我的域名是在阿里云上购买的，最初用的是阿里云万网的 DNS，后面改成了腾讯云上 dnspod 的 DNS，所以我在 dnspod 进行了域名解析之后，又在腾讯云后台申请了免费 SSL 证书。

- 域名解析：![域名解析](/uploads/post/jiexi.png)
- 免费证书：![免费证书](/uploads/post/ssl.png)

证书导入到群晖：

![证书导入](/uploads/post/upload_ssl.png)

使用域名成功访问群晖：

![访问群晖](/uploads/post/login.png)

至此，配置基本完成，后续慢慢摸索优化。
