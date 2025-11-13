'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { MotionWrapperFadeIn, MotionWrapperFlash } from '@/components/MotionWrapper'
import { PanelParticles } from '@/components/PanelParticles'
import ScrollProgressBar from '@/components/ScrollProgressBar'
import { Button } from '@/components/ui/button'
import { HoverEffect } from '@/components/ui/card-hover-effect'
import { FlipWords } from '@/components/ui/flip-words'
import { useLocale } from '@/hooks'
import { cn } from '@/lib/utils'
import styles from './ScaleboxHome.module.css'

// Hero 部分组件
export function ScaleboxHero() {
  const { t, currentLocale } = useLocale()
  const scaleboxConfig = t('scalebox')

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.badgeContainer}>
          <a
            className={styles.badge}
            href="https://github.com/yourusername/scalebox"
            target="_blank"
            rel="noopener noreferrer"
          >
            {scaleboxConfig.badge}
          </a>
        </div>


        <h1 className={styles.headline}>
          <MotionWrapperFlash
            disabledAnimation={false}
            className="flex items-center"
          >
            <span className="icon-[carbon--lightning]"></span>
          </MotionWrapperFlash>
          {' '}
          {scaleboxConfig.headline.part1}
          <br />
          {scaleboxConfig.headline.part2}
        </h1>

        <div
          className={cn([
            styles.subtitle,
            'text-neutral-500 dark:text-neutral-300',
          ])}
        >
          {scaleboxConfig.subtitle.prefix}
          {' '}
          <FlipWords
            words={scaleboxConfig.subtitle.words}
          />
          <br />
          {scaleboxConfig.subtitle.suffix}
          <br />
          {scaleboxConfig.subtitle.description}
        </div>

        <div className="flex justify-center pt-10">
          <div className="max-w-[500px] flex flex-wrap gap-[20px] max-sm:justify-center">
            <Button
              asChild
              size="lg"
              className="font-bold group max-sm:w-[100%]"
            >
              <Link href={`/${currentLocale}/introduction`}>
                {scaleboxConfig.buttons.getStarted}
                <span className="w-[20px] translate-x-[6px] transition-all group-hover:translate-x-[10px] icon-[mingcute--arrow-right-fill]"></span>
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="font-bold group max-sm:w-[100%]"
            >
              <Link href={`/${currentLocale}/api`}>
                {scaleboxConfig.buttons.viewDocs}
                <span className="ml-[6px] icon-[carbon--document]"></span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Section 组件
export const Section = ({
  title,
  description,
  children,
  className,
  tallPaddingY = false,
}: {
  title?: string
  description?: string
  children?: React.ReactNode
  className?: string
  tallPaddingY?: boolean
}) => {
  return (
    <section
      className={cn(
        'flex flex-col items-center justify-center px-6',
        className,
      )}
    >
      <MotionWrapperFlash>
        <h2
          className={cn(
            'relative',
            'text-center font-semibold',
            'bg-clip-text text-transparent bg-linear-to-b',
            'text-3xl md:text-5xl md:leading-tight pt-4',
            'from-neutral-700 to-black',
            'dark:from-neutral-800 dark:to-white',
            `${tallPaddingY ? 'pt-20 pb-10' : ''}`,
          )}
        >
          <span>{title}</span>
        </h2>
      </MotionWrapperFlash>
      <MotionWrapperFadeIn>
        {description && (
          <h2 className="text-sm md:text-base max-w-4xl my-4 mx-auto text-center font-normal text-zinc-600 dark:text-zinc-400">
            {description}
          </h2>
        )}
      </MotionWrapperFadeIn>
      {children}
    </section>
  )
}

// 图标和链接配置
const FEATURE_ICONS = [
  'icon-[carbon--flash]',
  'icon-[carbon--currency]',
  'icon-[carbon--cloud]',
  'icon-[carbon--ai-results]',
  'icon-[carbon--deployment-pattern]',
  'icon-[carbon--workflow-automation]',
]

const DOC_ICONS = [
  'icon-[carbon--document]',
  'icon-[carbon--api]',
  'icon-[carbon--logo-python]',
  'icon-[simple-icons--javascript]',
  'icon-[carbon--terminal]',
  'icon-[carbon--connect]',
  'icon-[carbon--skill-level-advanced]',
]

const DOC_LINKS = [
  'guide',
  'api-reference',
  'sdk/python',
  'sdk/javascript',
  'cli',
  'mcp',
  'skills',
]

// 主组件
export default function ScaleboxHome() {
  const { t, currentLocale } = useLocale()
  const scaleboxConfig = t('scalebox')

  // 核心特性列表
  const coreFeatures = useMemo(() => {
    return scaleboxConfig.features.map((feature, index) => ({
      ...feature,
      icon: <span className={FEATURE_ICONS[index]}></span>,
      link: `/${currentLocale}/guide`,
    }))
  }, [scaleboxConfig.features, currentLocale])

  // 文档导航列表
  const documentationSections = useMemo(() => {
    return scaleboxConfig.documentation.map((doc, index) => ({
      ...doc,
      icon: <span className={DOC_ICONS[index]}></span>,
      link: `/${currentLocale}/${DOC_LINKS[index]}`,
    }))
  }, [scaleboxConfig.documentation, currentLocale])

  return (
    <>
      <ScrollProgressBar />
      <PanelParticles />
      <ScaleboxHero />


      <div className="relative z-1 pb-10 md:pb-[100px]">
        {/* 核心特性部分 */}
        <Section
          title={scaleboxConfig.sections.coreFeatures.title}
          description={scaleboxConfig.sections.coreFeatures.description}
        >
          <div className="flex justify-center w-full max-w-7xl">
            <HoverEffect items={coreFeatures} />
          </div>
        </Section>

        {/* 文档导航部分 */}
        <Section
          title={scaleboxConfig.sections.documentation.title}
          description={scaleboxConfig.sections.documentation.description}
          tallPaddingY
        >
          <div className="flex justify-center w-full max-w-7xl">
            <HoverEffect items={documentationSections} />
          </div>
        </Section>
      </div>
    </>
  )
}
