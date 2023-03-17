import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Liucx分享干货铺",
  description: "前端技术分享",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/blog_logo.png',
    nav: [
      { text: '首页', link: '/' },
      { text: '算法', link: '/leetcode/' },
      { text: '前端', link: '/leetcode/' },
      { text: '后端', link: '/leetcode/' },
      { text: '运维', link: '/leetcode/' },
    ],
    sidebar: [
      {
        text: '题型分类',
        items: [
          { text: 'Array数组', link: '/leetcode/array' },
        ]
      },
    ],

    socialLinks: [
      { icon: 'discord', link: 'http://tech.tea-culture.top/' }
    ],
    lastUpdatedText: 'Updated Date' ,

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2023-present Liu'
    },
  },
  lastUpdated: true,
})
