import type { MetaRecord } from 'nextra'
import { TitleBadge } from '@/components/TitleBadge'

export default {
  index: {
    type: 'page',
    display: 'hidden',
    theme: {
      timestamp: false,
      layout: 'full',
      toc: false,
    },
  },
  introduction: {
    type: 'page',
    theme: {
      navbar: true,
      toc: false,
    },
  },
  docs: {
    title: '📦 示例代码',
    type: 'page',
  },
  api: {
    title: 'API 文档',
    type: 'page',
  },
  cli: {
    title: 'CLI 文档',
    type: 'page',
  },
  sdk: {
    title: 'SDK 文档',
    type: 'menu',
    items: {
      python: {
        title: 'Python SDK',
        href: '/zh/sdk/python',
      },
      javascript: {
        title: 'JavaScript SDK',
        href: '/zh/sdk/js',
      },
    },
  },
  upgrade: {
    title: (
      <span className="flex items-center leading-[1]">
        新变化
        <TitleBadge />
      </span>
    ),
    type: 'page',
  },
} satisfies MetaRecord
