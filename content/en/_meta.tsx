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
    title: 'This is Introduction',
    theme: {
      navbar: true,
      toc: false,
    },
  },
  docs: {
    title: '📦 Some Examples',
    type: 'page',
  },
  api: {
    title: 'API',
    type: 'page',
  },
  cli: {
    title: 'CLI',
    type: 'page',
  },
  sdk: {
    title: 'SDK Docs',
    type: 'menu',
    items: {
      python: {
        title: 'Python SDK',
        href: '/en/sdk/python',
      },
      javascript: {
        title: 'JavaScript SDK',
        href: '/en/sdk/js',
      },
    },
  },
  upgrade: {
    title: (
      <span className="flex items-center leading-[1]">
        What's New
        <TitleBadge />
      </span>
    ),
    type: 'page',
  },
} satisfies MetaRecord
