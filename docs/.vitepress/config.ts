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
      { text: '算法', items: [
        { text: '数组', link: '/leetcode/array'},
        { text: '双指针', link: '/leetcode/doublePointer'},
        { text: '字符串', link: '/leetcode/string'},
        { text: '栈', link: '/leetcode/stack'},
        { text: '树', link: '/leetcode/tree'},
      ] },
      { text: '前端', items: [
        { text: 'javascript', link: '/javascript/index'},
        { text: 'vue', link: '/vue/index'}
      ] },
      { text: '后端', link: '/leetcode/' },
      { text: '运维', items:[
        { text: 'Docker', link: '/docker/index' },
        { text: 'Nginx', link: '/nginx/index' },
      ] },
    ],
    // sidebar: [
    //   {
    //     text: '题型分类',
    //     items: [
    //       { text: 'Array数组', link: '/leetcode/array' },
    //     ]
    //   },
    // ],
    sidebar: {
      '/leetcode/': [{
        text: '题型分类',
        items: [
          { text: '数组', link: '/leetcode/array' },
          { text: '双指针', link: '/leetcode/doublePointer'},
          { text: '字符串', link: '/leetcode/string'},
          { text: '栈', link: '/leetcode/stack'},
          { text: '树', link: '/leetcode/tree'},          
        ]        
      }],
      '/docker/': [{
        text: 'docker相关',
        items: [
          { text: 'docker安装', link: '/docker/index' },
          { text: 'docker命令', link: '/docker/order' },
          { text: 'dockerfile介绍', link: '/docker/file' },
          { text: 'docker compose介绍', link: '/docker/compose' },
        ]        
      }],
      '/vue/':[{
        text: 'Vue3',
        items: [
          { text: '响应式', link: '/vue/responsive' },
          { text: '响应式的深入', link: '/vue/responsiveDeep' },
        ]        
      }],
    },

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
