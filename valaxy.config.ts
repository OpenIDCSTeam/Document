import { defineValaxyConfig } from 'valaxy'
import type { ThemePressConfig } from 'valaxy-theme-press'

export default defineValaxyConfig<ThemePressConfig>({
  theme: 'press',
  
  // GitHub Pages 配置
  base: process.env.NODE_ENV === 'production' ? '/Document/' : '/',
  
  siteConfig: {
    title: 'OpenIDCS',
    subtitle: '开源IDC虚拟化统一管理平台',
    description: '使用统一Web界面和RESTful API来管理多虚拟化平台的虚拟机基础设施',
    author: {
      name: 'OpenIDCS Team',
      email: 'openidcs@team.org',
      link: 'https://github.com/OpenIDCSTeam',
    },
    url: 'https://openidcs.org',
    lang: 'zh-CN',
    favicon: '/favicon.ico',
  },

  themeConfig: {
    logo: '/logo.svg',
    
    nav: [
      {
        text: '指南',
        items: [
          { text: '平台简介', link: '/guide/introduction' },
          { text: '功能概览', link: '/guide/features' },
          { text: '快速上手', link: '/guide/quick-start' },
        ],
      },
      {
        text: '配置指南',
        items: [
          { text: '受控端配置', link: '/config/client' },
          { text: '主控端配置', link: '/config/server' },
        ],
      },
      {
        text: '虚拟机配置',
        items: [
          { text: 'Docker/Podman', link: '/vm/docker' },
          { text: 'LXC/LXD', link: '/vm/lxd' },
          { text: 'VMware', link: '/vm/vmware' },
        ],
      },
      {
        text: '关于',
        items: [
          { text: '开源协议', link: '/about/license' },
          { text: '免责声明', link: '/about/disclaimer' },
          { text: '关于团队', link: '/about/team' },
        ],
      },
      {
        text: 'GitHub',
        link: 'https://github.com/OpenIDCSTeam/OpenIDCS-Client',
      },
    ],

    sidebar: {
      '/guide/': [
        {
          text: '平台简介',
          items: [
            { text: '项目介绍', link: '/guide/introduction' },
            { text: '功能概览', link: '/guide/features' },
            { text: '快速上手', link: '/guide/quick-start' },
          ],
        },
      ],
      '/config/': [
        {
          text: '配置指南',
          items: [
            { text: '受控端配置', link: '/config/client' },
            { text: '主控端配置', link: '/config/server' },
          ],
        },
      ],
      '/vm/': [
        {
          text: '虚拟机配置',
          items: [
            { text: 'Docker/Podman 配置', link: '/vm/docker' },
            { text: 'LXC/LXD 配置', link: '/vm/lxd' },
            { text: 'VMware 配置', link: '/vm/vmware' },
          ],
        },
      ],
      '/about/': [
        {
          text: '关于项目',
          items: [
            { text: '开源协议', link: '/about/license' },
            { text: '免责声明', link: '/about/disclaimer' },
            { text: '关于团队', link: '/about/team' },
          ],
        },
      ],
    },

    footer: {
      message: '基于 AGPLv3 许可发布',
      copyright: 'Copyright © 2024-present OpenIDCS Team',
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/OpenIDCSTeam/OpenIDCS-Client' },
    ],

    editLink: {
      pattern: 'https://github.com/OpenIDCSTeam/OpenIDCS-Client/edit/main/docs/pages/:path',
      text: '在 GitHub 上编辑此页',
    },

    search: {
      enable: true,
    },
  },
})
