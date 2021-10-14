---
title: Web 指标学习（about Sentry）
date: 2021-10-14 10:47:08
tags:
  - 性能
  - sentry
  - 翻译
---

[Web 指标](https://web.dev/vitals/)是一组由 Google 定义的指标，用于衡量呈现时间、响应时间和布局偏移。每个数据点都提供有关应用程序整体性能的见解。

Sentry SDK 收集 Web 指标信息（如果浏览器支持的话）并将该信息添加到前端事务中。然后将这些重要信息汇总在几个图表中，以便快速了解每个前端事务对用户的执行情况。

![Web Vitals 的可视化](/uploads/post/web-vitals-1.png)

## 核心 Web 指标

这些 Web 指标被谷歌认为是直接衡量用户体验的最重要的指标。[Google 报告称，截至 2021 年 5 月，这些指标也会影响网站的搜索排名](https://developers.google.com/search/blog/2020/11/timing-for-page-experience)。

### 最大的内容绘制 (LCP)

[最大内容绘制 (LCP)](https://web.dev/lcp/)测量最大内容出现在视口中的渲染时间。这可以是来自文档对象模型 (DOM) 的任何形式，例如图像（images）、SVG 或文本块（text blocks）。视口中最大的像素区域，因此最直观。**LCP 帮助开发人员了解用户看到页面上的主要内容需要多长时间。**

### 首次输入延迟 (FID)

[首次输入延迟 (FID)](https://web.dev/fid/)测量用户尝试与视口交互时的响应时间。操作可能包括单击按钮（button）、链接（link）或其他自定义 Javascript 控制器。**FID 提供有关应用程序页面上成功或不成功交互的关键数据。**

### 累积布局偏移 (CLS)

[累积布局偏移 (CLS)](https://web.dev/cls/)是渲染过程中每个意外元素偏移的单个布局偏移分数的总和。想象一下导航到一篇文章并尝试在页面完成加载之前单击链接。在您的光标到达那里之前，链接可能由于图像渲染而向下移动。**CLS 分数代表了破坏性和视觉不稳定转变的程度，而不是使用持续时间来表示此 Web 指标。**

![累积布局偏移示例](/uploads/post/web-vitals-2.png)

使用影响和距离分数计算每个布局偏移分数。影响分数是元素在两个渲染帧之间影响的总可见区域。距离分数测量它相对于视口移动的距离。

```sh
# Layout Shift Score = Impact Fraction * Distance Fraction
布局偏移分数 = 影响分数 * 距离分数
```

让我们看一下上面的例子，它有一个不稳定的元素——正文内容。影响分数大约为页面的 `50%`，并将正文文本向下移动 `20%`。布局移位得分为 `0.5 * 0.2 = 0.1`。因此，CLS 为 0.1。

## 其他 Web 指标

这些 Web 指标通常不太容易被用户看到，但对于排除核心 Web 指标的问题很有用。

### 首次渲染（FP）

首次渲染 (FP) 测量第一个像素出现在视口中所需的时间，呈现与先前显示内容相比的任何视觉变化。这可以是来自文档对象模型 (DOM) 的任何形式，例如背景颜色（background-color）、画布（canvas）或图像（image）。**FP 可帮助开发人员了解渲染页面是否发生了任何意外。**

### 首次内容绘制 (FCP)

[首次内容绘制 (FCP)](https://web.dev/fcp/)测量第一个内容在视口中呈现的时间。这可以是来自文档对象模型 (DOM) 的任何形式，例如图像、SVG 或文本块。**FCP 经常与首次渲染（FP）重叠。FCP 帮助开发人员了解用户在页面上看到内容更新需要多长时间。**

### 首字节时间 (TTFB)

首字节时间（TTFB）测量用户浏览器接收页面内容的第一个字节所需的时间。**TTFB 帮助开发人员了解他们的缓慢是由初始响应引起的还是由于渲染阻塞内容引起的。**

## 阈值

谷歌定义的三个阈值：“`好（GOOD）`”、“`需要改进（NEEDS IMPROVEMENT）`”和“`差（POOR）`”用于将数据点分类为绿色、黄色和红色，用于对应的 Web 指标。“需要改进（NEEDS IMPROVEMENT）”在 Sentry 中被称为“`Meh`”。

| Web 指标                                                                                                   | 好       | 需要改进 | 差      |
| ---------------------------------------------------------------------------------------------------------- | -------- | -------- | ------- |
| [最大的内容绘制](https://docs.sentry.io/product/performance/web-vitals/#largest-contentful-paint-lcp)(LCP) | <= 2.5s  | <= 4s    | > 4s    |
| [首次输入延迟](https://docs.sentry.io/product/performance/web-vitals/#first-input-delay-fid)(FID)          | <= 100ms | <= 300ms | > 300ms |
| [累积布局偏移](https://docs.sentry.io/product/performance/web-vitals/#cumulative-layout-shift-cls)(CLS)    | <= 0.1   | <= 0.25  | > 0.25  |
| [首次渲染](https://docs.sentry.io/product/performance/web-vitals/#first-paint-fp)(FP)                      | <= 1s    | <= 3s    | > 3s    |
| [首次内容绘制](https://docs.sentry.io/product/performance/web-vitals/#first-contentful-paint-fcp)(FCP)     | <= 1s    | <= 3s    | > 3s    |
| [首字节时间](https://docs.sentry.io/product/performance/web-vitals/#time-to-first-byte-ttfb)(TTFB)         | <= 100ms | <= 200ms | > 600ms |

> 一些 Web 指标（例如 FP、FCP、LCP 和 TTFB）是相对于事务的开始进行测量的。与使用其他工具（例如 Lighthouse ）生成的值相比，值可能会有所不同。

## 分布直方图

![分布直方图](/uploads/post/web-vitals-3.png)

Web 指标直方图显示数据分布，它可以通过揭示异常来帮助您识别和诊断前端性能问题。

默认情况下，异常值将从直方图中排除，以提供有关这些生命体征的更多信息视图。异常值是使用[上外栅栏（upper outer fence）](https://en.wikipedia.org/wiki/Outlier#Tukey's_fences)作为上限来确定的，任何高于上限的数据点都被视为异常值。

每个 Web 指标的垂直标记是观察到的数据点的第 75 个百分位。换句话说，25% 的记录值超过了该数量。

如果您注意到任何直方图上的感兴趣区域，请单击并拖动放大该区域以获得更详细的视图。您可能还想在直方图中查看与事务相关的更多信息。单击所选 Web 指标下方的“在发现中打开（Open in Discover）”以构建自定义查询以进行进一步调查。有关更多详细信息，请参阅 [Discover Query Builder](https://docs.sentry.io/product/discover-queries/query-builder/) 的完整文档。

如果您希望查看所有可用数据，请打开下拉菜单并单击“查看全部（View All）”。单击“查看全部”时，您可能会看到极端异常值。您可以单击并拖动放大某个区域以获得更详细的视图。

## 浏览器支持

| Web 指标                                                                                                   | Chrome | Edge | Opera | Firefox | Safari | IE  |
| ---------------------------------------------------------------------------------------------------------- | ------ | ---- | ----- | ------- | ------ | --- |
| [最大的内容绘制](https://docs.sentry.io/product/performance/web-vitals/#largest-contentful-paint-lcp)(LCP) | ✓      | ✓    | ✓     |         |        |     |
| [首次输入延迟](https://docs.sentry.io/product/performance/web-vitals/#first-input-delay-fid)(FID)          | ✓      | ✓    | ✓     | ✓       | ✓      | ✓   |
| [累积布局偏移](https://docs.sentry.io/product/performance/web-vitals/#cumulative-layout-shift-cls)(CLS)    | ✓      | ✓    | ✓     |         |        |     |
| [首次渲染](https://docs.sentry.io/product/performance/web-vitals/#first-paint-fp)(FP)                    | ✓      | ✓    | ✓     |         |        |     |
| [首次内容绘制](https://docs.sentry.io/product/performance/web-vitals/#first-contentful-paint-fcp)(FCP)     | ✓      | ✓    | ✓     | ✓       | ✓      |     |
| [首字节时间](https://docs.sentry.io/product/performance/web-vitals/#time-to-first-byte-ttfb)(TTFB)         | ✓      | ✓    | ✓     | ✓       | ✓      | ✓   |

> 原文：[Web Vitals](https://docs.sentry.io/product/performance/web-vitals/)
