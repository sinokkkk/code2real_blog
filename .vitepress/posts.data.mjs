// from https://github.com/vuejs/blog
import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { fileURLToPath } from 'url';
import { createMarkdownRenderer } from 'vitepress'


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const cwd = process.cwd()

export default {
  watch: path.relative(__dirname, cwd + '/posts/*.md').replace(/\\/g, '/'),
  async load(asFeed = false) {
    const md = await createMarkdownRenderer(cwd)
    const postDir = path.join(cwd, 'posts')
    checkTags()
    return fs
      .readdirSync(postDir)
      .filter((file) => file.endsWith('.md'))
      .map((file) => getPost(md, file, postDir, asFeed))
      .sort((a, b) => b.create - a.create)
  }
}

const cache = new Map()

function getPost(md, file, postDir, asFeed = false) {
  const fullePath = path.join(postDir, file)
  const timestamp = Math.floor(fs.statSync(fullePath).mtimeMs)

  const cached = cache.get(fullePath)
  if (cached && timestamp === cached.timestamp) {
    return cached.post
  }

  const src = fs.readFileSync(fullePath, 'utf-8')
  const { data, content } = matter(src)
  const excerpt = createExcerpt(content, data)

  const post = {
    title: data.title,
    href: `posts/${file.replace(/\.md$/, '.html')}`,
    create: +new Date(data.date) || timestamp,
    update: timestamp,
    tags: data.tags,
    cover: data.cover,
    excerpt: md.render(excerpt)
  }
  if (asFeed) {
    // only attach these when building the RSS feed to avoid bloating the
    // client bundle size
    post.data = data
  }

  cache.set(fullePath, {
    timestamp,
    post
  })
  return post
}

function createExcerpt(content, data) {
  if (typeof data.description === 'string' && data.description.trim()) {
    return data.description.trim()
  }

  const beforeMore = content.split(/<!--\s*more\s*-->/i)[0]
  const blocks = []
  let current = []
  let inFence = false

  for (const line of beforeMore.split(/\r?\n/)) {
    const trimmed = line.trim()

    if (trimmed.startsWith('```')) {
      inFence = !inFence
      continue
    }
    if (inFence) continue

    if (!trimmed) {
      pushExcerptBlock(blocks, current)
      current = []
      if (blocks.length >= 2) break
      continue
    }

    current.push(line)
  }

  pushExcerptBlock(blocks, current)
  return blocks.slice(0, 2).join('\n\n')
}

function pushExcerptBlock(blocks, lines) {
  const text = lines.join('\n').trim()
  if (!text || !isExcerptTextBlock(text)) return
  blocks.push(text)
}

function isExcerptTextBlock(text) {
  return ![
    /^#/,
    /^</,
    /^<!--/,
    /^\|/,
    /^[-*+]\s+/,
    /^\d+\.\s+/
  ].some((pattern) => pattern.test(text))
}

function checkTags() {
  const dir = path.join(cwd, 'tags')
  if (!fs.existsSync(dir)) {
    console.log('Creating page: /tags')
    fs.mkdirSync(dir)
    fs.writeFileSync('tags/index.md', '---\ntitle: 标签\n---\n')
  }
}
