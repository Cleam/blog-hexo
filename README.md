# blog-hexo

> 个人博客[https://blog.lizimu.top](https://blog.lizimu.top)或[https://cleam.github.io/](https://cleam.github.io/)

## 开发

```bash
# 开发
npm run dev

# 打包预览
npm run preview

# 发布
npm run deploy
```

[常见编写技巧](./skill.md)

## Hexo 命令

1. new：新建一篇文章

```bash
# new
hexo new [layout] <title>
# hexo new "post title with whitespace"
# hexo new page --path about/me
```

| 选项            | 描述                                          |
| --------------- | --------------------------------------------- |
| `-p, --path`    | 自定义新文章的路径                            |
| `-r, --replace` | 如果存在同名文章，将其替换                    |
| `-s, --slug`    | 文章的 Slug，作为新文章的文件名和发布后的 URL |

2. server：启动服务

```bash
hexo server
```

| 选项         | 描述                           |
| ------------ | ------------------------------ |
| `-p, --port` | 重设端口                       |
| `-l, --log`  | 启动日记记录，使用覆盖记录格式 |

3. generate：生成静态文件

```bash
hexo generate
# 简写：hexo g
```

| 选项                | 描述                                                                                                                                                             |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `-d, --deploy`      | 文件生成后立即部署网站                                                                                                                                           |
| `-w, --watch`       | 监视文件变动                                                                                                                                                     |
| `-b, --bail`        | 生成过程中如果发生任何未处理的异常则抛出异常                                                                                                                     |
| `-f, --force`       | 强制重新生成文件<br/>Hexo 引入了差分机制，如果 public 目录存在，<br/>那么 hexo g 只会重新生成改动的文件。<br/>使用该参数的效果接近 `hexo clean && hexo generate` |
| `-c, --concurrency` | 最大同时生成文件的数量，默认无限制                                                                                                                               |

4. publish: 发表草稿

```bash
hexo publish [layout] <filename>
```

5. deploy: 部署网站

```bash
hexo deploy
# 简写：hexo d
```

| 选项             | 描述                     |
| ---------------- | ------------------------ |
| `-g, --generate` | 部署之前预先生成静态文件 |

6. render: 渲染文件

```bash
hexo render <file1> [file2] ...
```

| 选项           | 描述         |
| -------------- | ------------ |
| `-o, --output` | 设置输出路径 |

7. migrate: 博客迁移

```bash
hexo migrate <type>
```

> 更多：https://hexo.io/zh-cn/docs/migration

8. clean: 清除缓存

清除缓存文件 (db.json) 和已生成的静态文件 (public)

```bash
hexo clean
```

9. list: 列出网站资料

```bash
hexo list <type>
```

10. version: 显示 hexo 版本

```bash
hexo version
```
