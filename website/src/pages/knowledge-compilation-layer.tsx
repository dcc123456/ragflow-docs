import type { ReactNode } from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Icon from '@site/src/components/Icon';
import { cn } from '@site/src/utils/twUtils';

import FxEdgeInnerLightEffect from '@site/src/utils/visual-effects/FxEdgeInnerLightEffect';
import FxGradientText from '@site/src/utils/visual-effects/FxGradientText';
import FxGlowEffect from '@site/src/utils/visual-effects/FxGlowEffect';

import commonStyles from './index.module.scss';
import styles from './knowledge-compilation-layer.module.scss';
import BrainAnimation from './_animations/BrainAnimation';
import HowAnimation from './_animations/HowAnimation';

const LAYER_LABELS = ['Retrieval harness', 'Index layer', 'Compilation layer', 'Document harness'];

const WHY_IT_MATTERS = [
  {
    icon: 'LucideCrosshair',
    title: 'Precision',
    description:
      'Deliver structured, knowledge-rich context that helps LLMs reason better, generate.',
  },
  {
    icon: 'LucideBot',
    title: 'Agent-Native',
    description:
      'Deliver structured, knowledge-rich context that helps LLMs reason better, generate.',
  },
  {
    icon: 'LucideLayers',
    title: 'High-Quality Context',
    description:
      'Deliver structured, knowledge-rich context that helps LLMs reason better, generate.',
  },
];

const FLOW_STEPS = [
  { label: 'Parser' },
  { label: 'Extractor' },
  { label: 'Reconciliation' },
  { label: 'Synthesis' },
  { label: 'Templates' },
  { label: 'Index' },
  { label: 'AI agents' },
];

const BENCHMARK_BARS = [
  { primary: 80, secondary: 50, label: 'Name #1' },
  { primary: 120, secondary: 60, label: 'Name #1' },
  { primary: 100, secondary: 70, label: 'Name #1' },
  { primary: 130, secondary: 75, label: 'Name #1' },
  { primary: 110, secondary: 65, label: 'Name #1' },
  { primary: 140, secondary: 80, label: 'Name #1' },
];

export default function KnowledgeCompilationLayerPage(): ReactNode {
  return (
    // <Layout
    //   title='Knowledge Compilation Layer'
    //   description='Turn raw enterprise data into structured, reusable knowledge assets for AI systems.'
    //   wrapperClassName={commonStyles.page}
    // >
    <div className={commonStyles.page}>
      <div className='text-standard text-sm mobile:text-base'>
        {/* Hero */}
        <header className='relative container max-desktop:px-page pt-10 mobile:pt-20 desktop:pt-10 pb-10 mobile:pb-20 desktop:pb-28'>
          <FxEdgeInnerLightEffect
            position='bottom'
            className='w-[150%] min-w-[960px] h-[600px] left-1/2 -translate-x-1/2 bottom-0 opacity-75 mix-blend-screen'
            aria-hidden='true'
          />
          <div className={styles.hero}>
            <div className='flex flex-col gap-6'>
              <h1 className='text-hero leading-tight text-start flex flex-col gap-2 items-start'>
                <FxGradientText preset='primary' direction='right'>
                  Knowledge
                </FxGradientText>
                <FxGradientText preset='primary' direction='right'>
                  Compilation Layer
                </FxGradientText>
              </h1>
              <p className='text-secondary text-lg desktop:text-xl leading-loose max-w-md'>
                Turn raw enterprise data into structured, reusable knowledge assets for AI systems.
              </p>
              <FxGlowEffect className='self-start'>
                <Link
                  to='https://cloud.ragflow.io/'
                  className={cn(styles.btn, 'legacy-btn', 'block px-6 py-3 rounded-sm text-base')}
                >
                  Get started
                </Link>
              </FxGlowEffect>
            </div>

            {/* Hero Visual - Placeholder for cube / layer visualization */}
            <div className={styles.heroVisual} aria-hidden='true'>
              <div className={styles.layerStack}>
                <BrainAnimation />
              </div>
              <ul className={styles.layerLabels}>
                {LAYER_LABELS.map((label) => (
                  <li key={label}>
                    <span />
                    <span>{label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </header>

        <div className='relative container max-desktop:px-page pb-64 space-y-48'>
          <FxEdgeInnerLightEffect
            position='top'
            className='w-[150%] min-w-[960px] h-[600px] left-1/2 -translate-x-1/2 top-0 opacity-75 mix-blend-screen'
            // className='w-[150%] min-w-[960px] h-[600px] left-1/2 -translate-x-1/2 -translate-y-1/2 top-[108px] opacity-50 mix-blend-screen'
            aria-hidden='true'
          />

          {/* Why it Matters */}
          <section aria-labelledby='why-it-matters' className='!mt-0'>
            <div className='flex flex-col items-start gap-3 mb-12'>
              <span className='inline-block h-1 rounded-full w-8 bg-[rgb(var(--ragflow-color-primary))]' />
              <h2 id='why-it-matters' className='text-sm uppercase tracking-wider text-secondary'>
                Why it Matters
              </h2>
            </div>

            <div className={styles.whyMatters}>
              {WHY_IT_MATTERS.map(({ icon, title, description }) => (
                <article key={title} className={styles.whyItem}>
                  <div className='flex items-center gap-3'>
                    <Icon icon={icon as any} className={styles.whyIcon} />
                    <h3 className='text-primary my-auto'>
                      <FxGradientText preset='primary' direction='right'>
                        {title}
                      </FxGradientText>
                    </h3>
                  </div>
                  <p className='text-secondary leading-loose'>{description}</p>
                </article>
              ))}
            </div>
          </section>

          {/* How it works - Placeholder */}
          <section aria-labelledby='how-it-works'>
            <div className={cn(styles.howItWorks, styles.flowPlaceholder)}>
              <header className='absolute top-6 left-6 z-10'>
                <h2 id='how-it-works' className='text-2xl mb-2'>
                  <FxGradientText preset='primary' direction='right'>
                    HOW IT WORKS
                  </FxGradientText>
                </h2>
                <p className='text-secondary text-sm leading-relaxed max-w-3xl'>
                  The Knowledge Compilation Engine applies semantic templates to transform parsed
                  documents into structured knowledge artifacts, which are then indexed to power AI
                  agents.
                </p>
              </header>

              <div className='pt-20 w-full h-[200px] mobile:h-[300px] desktop:h-[500px]'>
                <HowAnimation className='w-full h-full' />
              </div>
            </div>
          </section>

          {/* See it in action - Placeholder video */}
          <section aria-labelledby='see-in-action' className='space-y-8 flex items-center'>
            <div className='flex flex-col gap-4 max-w-md'>
              <h2 id='see-in-action' className='text-3xl'>
                <FxGradientText preset='primary' direction='right'>
                  See it in action
                </FxGradientText>
              </h2>
              <p className='text-secondary leading-loose'>
                Watch how RAGFlow compiles enterprise knowledge into reusable knowledge artifacts.
              </p>
              <FxGlowEffect className='self-start'>
                <Link
                  to='https://cloud.ragflow.io/'
                  className={cn(styles.btn, 'legacy-btn', 'block px-6 py-3 rounded-sm')}
                >
                  Get started
                </Link>
              </FxGlowEffect>
            </div>

            <div className={styles.videoPreview} aria-label='Video preview placeholder'>
              <button type='button' className={styles.playButton} aria-label='Play video'>
                <Icon icon='LucidePlay' className='size-6' />
              </button>
            </div>
          </section>

          {/* Benchmarks - Placeholder chart */}
          <section aria-labelledby='benchmarks' className='space-y-8'>
            <div>
              <h2 id='benchmarks' className='text-3xl mb-2'>
                <FxGradientText preset='primary' direction='right'>
                  Benchmarks
                </FxGradientText>
              </h2>
              <p className='text-secondary leading-loose'>
                State of the agentic search, refined by knowledge compilation
              </p>
            </div>

            <div className={styles.benchmarksChart} aria-label='Benchmarks chart placeholder'>
              {BENCHMARK_BARS.map((bar, i) => (
                <div key={i} className={styles.barGroup}>
                  <div className={styles.barPair}>
                    <div
                      className={styles.bar}
                      style={{ height: `${bar.primary}px` }}
                      aria-hidden='true'
                    />
                    <div
                      className={styles.bar}
                      style={{
                        height: `${bar.secondary}px`,
                        opacity: 0.5,
                      }}
                      aria-hidden='true'
                    />
                  </div>
                  <span className={styles.barLabel}>{bar.label}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Start building */}
          <section className={cn(styles.startBuilding, 'mt-32')} aria-labelledby='start-building'>
            <h2 id='start-building' className='text-5xl mb-12'>
              <FxGradientText preset='primary' direction='right'>
                Start building
              </FxGradientText>
            </h2>

            <div className='flex justify-center items-center gap-6'>
              <FxGlowEffect>
                <Link
                  to='https://cloud.ragflow.io/'
                  className={cn(styles.btn, 'legacy-btn', 'block px-6 py-3')}
                >
                  Try demo
                </Link>
              </FxGlowEffect>

              <Link
                to='https://github.com/infiniflow/ragflow'
                className='border-0 bg-standard px-6 py-3'
              >
                Github
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
    // </Layout>
  );
}
