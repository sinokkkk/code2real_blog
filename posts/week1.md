---
title: Week 1 | Git 与 HTML 入门
date: 2026-03-03
tags: [课程周志, Git, HTML]
cover: /code2real_blog/posts/week1/speede.jpg
---

第一周的重点并不在于完成某个具体作品，而在于建立后续课程开展所需的基础环境。本周主要学习 Git 的基本使用方式，并开始使用 HTML 搭建课程网站。

---

<img :src="'/code2real_blog/posts/week1/speede.jpg'" alt="Week 1 image" />

## 本周学习内容  
本周聚焦两项基础工具：Git 与 HTML。Git 部分涉及仓库初始化、文件追踪、提交记录管理以及与远程仓库交互的基本概念；HTML 部分围绕网页标准结构、常用标签展开，并开始搭建个人课程网站的初始页面。这周工作主要为后续周志、文件归档和阶段成果整理建立统一框架。

## 实践过程  
Git 实践中，我梳理了工作区、暂存区、本地仓库和远程仓库之间的协作关系。通过依次执行 `git init`、`git add`、`git commit` 等操作，明确“修改文件—加入暂存区—生成提交记录”的边界，体会到版本控制在课程项目中的工程价值。  
HTML 方面，从标准文档骨架（`<!DOCTYPE html>`、`<html>`、`<head>`、`<body>`）开始，练习标题、段落、图片、超链接等元素，搭建了页面间跳转关系，初步理解内容组织与文件路径依赖。

## 遇到的问题  
混淆主要出现在 Git 工作流中：起初容易把工作区改动与已提交状态等同，对 `git add` 和 `git commit` 的职责划分不够清晰。经过反复操作，才确切区分“修改”“暂存”“记录”三阶段。  
HTML 的困难集中于相对路径配置：页面可正常显示，但图片或链接因路径层级错误而加载失败。定位后发现需仔细核对 `src`、`href` 中的目录引用，确保相对路径正确。

## 本周收获

掌握了课程网站的基本构成与 Git 的记录机制，为后续内容更新和历史追溯提供支撑。第一周虽然偏基础，但确立了记录规范与文件组织方式，使后续产出可被持续、清晰地保存，对整个课程具有明显的奠基作用。

---

## 友情链接

https://git-scm.com/book/en/v2

https://missing.csail.mit.edu/2020/version-control/

https://github.com/sinokkkk/code2real_blog

<img :src="'/code2real_blog/posts/week1/1.png'" alt="Week 1 image" />
