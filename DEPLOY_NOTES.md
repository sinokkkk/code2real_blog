# 博客部署与写文章避坑记录

这份记录用于提醒自己：这个项目是从 `vitepress-theme-sakura` 主题改来的，但现在发布到我自己的 GitHub 仓库 `sinokkkk/code2real_blog`。以后新增文章、改图片、部署 GitHub Pages 前，先按这里检查一遍。

## 我的项目信息

- GitHub 用户名：`sinokkkk`
- GitHub 仓库名：`code2real_blog`
- GitHub Pages 地址：`https://sinokkkk.github.io/code2real_blog/`
- 本地项目文件夹名：`vitepress-theme-sakura`
- 当前发布分支：源码在 `main`，构建产物在 `gh-pages`

注意：本地文件夹名不决定网页路径。GitHub Pages 的路径由仓库名决定，所以本项目的线上路径前缀是 `/code2real_blog/`。

## 必须改成属于我的内容

### `.vitepress/config.ts`

这些字段要使用我自己的信息：

```ts
title: 'sinok的代码到实物个人博客',
base: '/code2real_blog/',
```

主题配置也要用我的路径和账号：

```ts
themeConfig: {
  name: 'sinok',
  cover: '/code2real_blog/60651947_p0.jpg',
  motto: '代码到实物-个人博客',
  hello: 'Hello SINOK',
  social: [
    { icon: 'fa-github', url: 'https://github.com/sinokkkk' },
    { icon: 'fa-bilibili', url: 'https://bilibili.com' },
  ],
}
```

不要再使用原主题仓库名：

```ts
base: '/vitepress-theme-sakura/'
```

也不要把 `cover` 写成这样：

```ts
cover: 'cover: /code2real_blog/60651947_p0.jpg'
```

正确写法是：

```ts
cover: '/code2real_blog/60651947_p0.jpg'
```

## GitHub Pages 设置

Actions 成功后，构建产物会被推到 `gh-pages` 分支。

GitHub 仓库页面里需要设置：

```text
Settings -> Pages
Source: Deploy from a branch
Branch: gh-pages
Folder: /root
```

不要选：

```text
main / root
```

如果选了 `main / root`，GitHub 会直接发布源码目录里的 `index.md`，页面就会变成只显示 `code2real_blog` 和 `index`，而不是 Sakura 主题首页。

## GitHub Actions 注意事项

当前 workflow 文件是：

```text
.github/workflows/build.yml
```

它应该监听 `main` 分支：

```yml
on:
  push:
    branches:
      - main
```

并且需要写入权限：

```yml
permissions:
  contents: write
```

如果 Actions 报：

```text
Resource not accessible by integration
```

去 GitHub 仓库设置：

```text
Settings -> Actions -> General -> Workflow permissions
```

选择：

```text
Read and write permissions
```

本项目不需要自动打 tag，也不需要 npm publish。之前原主题里的自动打 tag 和 npm 发布步骤容易导致权限问题，可以删掉。

## 图片和视频路径规则

所有公开资源建议放在 `public` 目录。

例如文章资源放这里：

```text
public/posts/voice-smart-light/cover.jpg
public/posts/voice-smart-light/wiring-01.jpg
public/posts/voice-smart-light/case-front.jpg
```

文章里访问时必须带上 GitHub Pages 的 base：

```html
<img :src="'/code2real_blog/posts/voice-smart-light/wiring-01.jpg'" alt="初期语音识别模块接线 1" />
```

文章封面 frontmatter 也一样：

```md
---
cover: /code2real_blog/posts/voice-smart-light/cover.jpg
---
```

不要写成旧主题路径：

```md
cover: /vitepress-theme-sakura/60651947_p0.jpg
```

正确是：

```md
cover: /code2real_blog/60651947_p0.jpg
```

## 图片占位符的坑

如果图片还没放进 `public`，普通 Markdown 图片可能会让构建失败：

```md
![图片](/code2real_blog/posts/voice-smart-light/wiring-01.jpg)
```

VitePress 会尝试在构建阶段解析这个资源。如果文件不存在，`npm run build` 会失败。

临时占位推荐用 Vue 绑定写法：

```html
<img :src="'/code2real_blog/posts/voice-smart-light/wiring-01.jpg'" alt="图片说明" />
```

等图片真的放到 `public` 后，这种写法也能正常显示。

## Typora 粘贴图片的坑

不要把 Typora 自动生成的本机路径提交进文章：

```md
![image](C:\Users\32455\AppData\Roaming\Typora\typora-user-images\image-xxx.png)
```

这会导致 VitePress 构建报错：

```text
Legacy octal escape is not permitted in strict mode
```

原因是 Windows 路径里的反斜杠会被当成 JavaScript 转义字符。

正确做法：

1. 把图片复制到 `public/posts/文章目录/`
2. 在 Markdown 里写 `/code2real_blog/...` 路径
3. 提交前搜索是否残留本机路径

检查命令：

```powershell
Select-String -Path posts\*.md -Pattern 'AppData','Typora','typora-user-images','C:\Users','\\Users' -SimpleMatch
```

## 发布前检查清单

每次 push 前先执行：

```powershell
npm run build
```

如果构建通过，再提交：

```powershell
git add .
git commit -m "你的提交说明"
git push origin main
```

如果页面显示旧内容：

1. 先确认 Actions 是否成功。
2. 再确认 Pages 是否发布 `gh-pages / root`。
3. 浏览器按 `Ctrl + F5` 强制刷新。
4. 或打开 `https://sinokkkk.github.io/code2real_blog/?v=2` 绕过缓存。

## 这次遇到的问题总结

1. `base` 一开始仍然使用原主题仓库名 `/vitepress-theme-sakura/`，导致 GitHub Pages 上资源路径不对。
2. 本地文件夹名没有关系，真正决定线上路径的是 GitHub 仓库名 `code2real_blog`。
3. GitHub Pages 如果选了 `main / root`，会发布源码，不会发布 VitePress 构建结果。
4. 原 workflow 里自动打 tag 和 npm publish 对个人博客没必要，还会引起权限错误。
5. 文章中引用还不存在的图片资源，会让 VitePress 构建失败。
6. Typora 粘贴图片时容易插入 `C:\Users\...` 本机路径，提交后会让 Actions 构建失败。
7. GitHub Pages 和浏览器都有缓存，Actions 成功后页面可能还要等一会儿，必要时强刷。

以后新增文章时，最稳的流程是：先写 Markdown，再把图片放到 `public`，确认所有路径都是 `/code2real_blog/...`，最后运行 `npm run build`。
