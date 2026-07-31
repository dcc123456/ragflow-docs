import type { ReactNode } from 'react';

import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

// import Icon from '@site/src/components/Icon';
import { cn } from '@site/src/utils/twUtils';

import styles from './index.module.scss';

import IndexHeroBgAnimation from './_animations/IndexHeroBgAnimation';

import FxEdgeInnerLightEffect from '@site/src/utils/visual-effects/FxEdgeInnerLightEffect';
import FxGradientText from '@site/src/utils/visual-effects/FxGradientText';
import FxGlowEffect from '@site/src/utils/visual-effects/FxGlowEffect';
import FxPolkaDotsBackgroundEffect from '@site/src/utils/visual-effects/FxPolkaDotsBackgroundEffect';

import IndexFeatureEtlAnimation from './_animations/IndexFeatureEtlAnimation';
import IndexFeatureHybridSearchAnimation from './_animations/IndexFeatureHybridSearchAnimation';
import IndexFeatureUnifiedAgentAnimation from './_animations/IndexFeatureUnifiedAgentAnimation';
import IndexSolutionEquityInvestmentResearchAnimation from './_animations/IndexSolutionEquityInvestmentResearchAnimation';
import IndexSolutionLegalPrecedentAnalysisAnimation from './_animations/IndexSolutionLegalPrecedentAnalysisAnimation';
import IndexSolutionManufacturingMaintenanceSupportAnimation from './_animations/IndexSolutionManufacturingMaintenanceSupportAnimation';

import IndexTestimonials from './_components/IndexTestimonials';
import IndexPricingPlans from './_components/IndexPricingPlans';
import KnowledgeCompilationAnimation from './_animations/KnowledgeCompilationAnimation';
import HomepageRightAnimation from './_animations/HomepageRight';
import ThreadsBackground from './_animations/ThreadsBackground';
import DualRowScrollingCards from './_components/DualRowScrollingCards';

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  const PRIMARY_COLOR: [number, number, number] = [0, 0.745, 0.706];
  return (
    <Layout
      title={siteConfig.title}
      description={siteConfig.tagline}
      wrapperClassName={styles.page}
    >
      <div className='text-standard text-sm mobile:text-base'>
        {/* Hero */}
        <header
          className='
            relative flex justify-start items-center
            min-h-max
            container max-desktop:px-page
            pt-8 mobile:pt-12 desktop:pt-20
            pb-16 mobile:pb-20 desktop:pb-28
            text-start text-lg desktop:text-2xl
            mobile:text-center mobile:flex-col
          '
        >
          <IndexHeroBgAnimation key='fxHeroBgEffect' aria-hidden='true' />
          <div className='w-full flex gap-2 mobile:gap-4 mobile:flex-col desktop:flex-row'>
            <div className='desktop:w-1/2 w-full mobile:w-full flex flex-col items-start justify-start'>
              <h1
                className='
              mx-auto text-start text-hero leading-relaxed
              drop-shadow-[0_0_2em_rgb(var(--ragflow-theme-white))] text-pretty
              mb-4 mobile:mb-2 desktop:mb-4'
              >
                <FxGradientText preset='text'>Build a superior context layer for</FxGradientText>
                <span> </span>
                <FxGradientText className='whitespace-nowrap' preset='primary' direction='right'>
                  AI Agents
                </FxGradientText>
              </h1>

              <h4 className='text-start text-secondary leading-loose w-[80%]'>
                Empower your AI agents through the leading open-source RAG engine, delivering
                reliable context and an integrated agent platform, built for enterprise.
              </h4>

              <FxGlowEffect className='mobile:mt-2 desktop:mt-4 mobile:ml-0 desktop:ml-4'>
                <Link
                  to='https://cloud.ragflow.io/'
                  className={cn(styles.btn, 'legacy-btn', 'block px-6 py-2 rounded-sm')}
                >
                  Get Started
                </Link>
              </FxGlowEffect>
            </div>

            <div className='desktop:w-1/2 w-full mobile:w-full flex flex-col items-start justify-start bg-[rgba(var(--ragflow-bg-standard),0.05)] backdrop-blur-[4px]'>
              <HomepageRightAnimation />
            </div>
          </div>

          <FxEdgeInnerLightEffect
            position='bottom'
            className='w-[150%] min-w-[960px] h-[600px] left-1/2 -translate-x-1/2 bottom-0 opacity-75 mix-blend-screen'
          />
        </header>

        {/* Main content */}
        <div
          className='
            relative -mt-8 pb-64
            container max-desktop:px-page
          '
        >
          <FxEdgeInnerLightEffect
            position='top'
            className='w-[150%] min-w-[960px] h-[600px] left-1/2 -translate-x-1/2 top-8 opacity-75 mix-blend-screen'
          />

          <main className='relative z-1 space-y-48'>
            {/* Features */}

            <section
              className='max-desktop:space-y-6 desktop:grid desktop:grid-cols-2 desktop:gap-6'
              aria-label='Features'
            >
              <article className={cn('desktop:col-span-2 bg-standard', styles.card, 'legacy-card')}>
                <header className='flex justify-between items-center'>
                  <h2 id='feature-knowledge-compilation'>
                    <FxGradientText preset='primary' direction='right'>
                      Knowledge compilation
                    </FxGradientText>
                  </h2>
                  <h4 className='cursor-pointer'>
                    <Link to='/knowledge-compilation-layer' className='no-underline'>
                      <FxGradientText preset='primary' direction='right'>
                        Learn more &gt;
                      </FxGradientText>
                    </Link>
                  </h4>
                </header>

                <p className='text-secondary leading-loose'>
                  Evolve continuously as new data and insights are compiled, ensuring your knowledge
                  always stays current and relevant.
                </p>

                <KnowledgeCompilationAnimation
                  key='animation'
                  className='w-full max-h-[280px] aspect-video'
                  role='img'
                  aria-labelledby='feature-knowledge'
                />
              </article>

              <article className={cn('flex flex-col bg-standard', styles.card, 'legacy-card')}>
                <header>
                  <h2 id='feature-1'>
                    <FxGradientText preset='primary' direction='right'>
                      ETL for AI data
                    </FxGradientText>
                  </h2>
                </header>

                <p>
                  Harness our built-in ingestion pipeline to cleanse and process multi-format data,
                  structuring it into rich semantic representations for superior retrieval.
                </p>

                <IndexFeatureEtlAnimation
                  key='animation'
                  className='w-full max-h-[280px] aspect-video'
                  role='img'
                  aria-labelledby='feature-1'
                />
              </article>

              <article className={cn('flex flex-col bg-standard', styles.card, 'legacy-card')}>
                <header>
                  <h2 id='feature-2'>
                    <FxGradientText preset='primary' direction='right'>
                      High-Precision hybrid search
                    </FxGradientText>
                  </h2>
                </header>

                <p>
                  Combine vector search, BM25, and custom scoring with advanced re-ranking to
                  deliver unmatched answer accuracy and context relevance.
                </p>

                <IndexFeatureHybridSearchAnimation
                  key='animation'
                  className=' w-full max-h-[280px] aspect-video'
                  role='img'
                  aria-labelledby='feature-2'
                />
              </article>

              {/* <article className={cn("desktop:col-span-2 bg-standard", styles.card, "legacy-card")}>
                <header>
                  <h2 id="feature-3">
                    <FxGradientText preset="primary" direction="right">
                      Unified AI agent orchestration
                    </FxGradientText>
                  </h2>
                </header>

                <p>
                  Build powerful agents in an all-in-one platform, seamlessly integrating RAG,
                  tools, and MCPs within visual workflows.
                </p>

                <IndexFeatureUnifiedAgentAnimation
                  key="animation"
                  className="w-full max-h-[280px] aspect-video"
                  role="img"
                  aria-labelledby="feature-3"
                />
              </article> */}
            </section>

            {/* Solutions */}
            <section className='space-y-12' aria-label='Solutions'>
              <header>
                <h1 id='solutions' className='mb-24 text-center'>
                  <FxGradientText preset='primary' direction='right'>
                    Smart solutions for every industry
                  </FxGradientText>
                </h1>
              </header>

              <article className='flex flex-col items-center desktop:flex-row gap-8 desktop:gap-16'>
                <div>
                  <header>
                    <h2 id='solution-1'>
                      <FxGradientText preset='primary info' direction='right'>
                        Equity investment research
                      </FxGradientText>
                    </h2>
                  </header>

                  <p>
                    This workflow automates company data collection and consolidates financial
                    metrics with research insights. Enables advanced stock analysis through
                    autonomous planning and multi-agent orchestration.
                  </p>

                  <p className='mb-0'>
                    It starts by identifying stock tickers from user queries, then aggregates
                    insights from external authoritative sources and internal records. Ultimately,
                    these qualitative insights are combined with financial metrics to yield a
                    complete investment report.
                  </p>
                </div>

                <FxPolkaDotsBackgroundEffect
                  className={cn(
                    styles.card,
                    'legacy-card',
                    'p-2 flex-none desktop:w-3/5 w-full desktop:max-h-[480px] aspect-video'
                  )}
                >
                  <IndexSolutionEquityInvestmentResearchAnimation
                    key='animation'
                    className='size-full'
                    role='img'
                    aria-labelledby='solution-1'
                  />
                </FxPolkaDotsBackgroundEffect>
              </article>

              <article className='flex flex-col items-center desktop:flex-row gap-8 desktop:gap-16'>
                <div>
                  <header>
                    <h2 id='solution-2'>
                      <FxGradientText preset='primary info' direction='right'>
                        Legal precedent analysis
                      </FxGradientText>
                    </h2>
                  </header>

                  <p>
                    This workflow provides structured precedent analysis by examining binding and
                    persuasive authority across public case law and internal matter records.
                  </p>

                  <p className='mb-0'>
                    Upon case input, key attributes—such as jurisdiction, court level, and legal
                    issues—are automatically extracted to formulate search queries and retrieve
                    relevant precedents with their ratio decidendi. The results are then
                    consolidated into a structured analysis reflecting how courts reasoned and ruled
                    on analogous legal questions, with citations and distinguishing factors ready
                    for argument.
                  </p>
                </div>

                <FxPolkaDotsBackgroundEffect
                  className={cn(
                    styles.card,
                    'legacy-card',
                    'p-2 flex-none desktop:w-3/5 w-full desktop:max-h-[480px] aspect-video'
                  )}
                >
                  <IndexSolutionLegalPrecedentAnalysisAnimation
                    key='animation'
                    className='size-full'
                    role='img'
                    aria-labelledby='solution-2'
                  />
                </FxPolkaDotsBackgroundEffect>
              </article>

              <article className='flex flex-col items-center desktop:flex-row gap-8 desktop:gap-16'>
                <div>
                  <header>
                    <h2 id='solution-2'>
                      <FxGradientText preset='primary info' direction='right'>
                        Manufacturing maintenance support
                      </FxGradientText>
                    </h2>
                  </header>

                  <p>
                    This workflow provides structured maintenance guidance by accurately sourcing
                    content from internal manuals, with external references used as supplementary
                    support.
                  </p>

                  <p className='mb-0'>
                    When a task is entered, the workflow first validates input sufficiency—ensuring
                    essential details are present—then extracts standard protocols from internal
                    maintenance manuals, integrates supplementary external technical data, and
                    produces clear execution instructions.
                  </p>
                </div>

                <FxPolkaDotsBackgroundEffect
                  className={cn(
                    styles.card,
                    'legacy-card',
                    'p-2 flex-none desktop:w-3/5 w-full desktop:max-h-[480px] aspect-video'
                  )}
                >
                  <IndexSolutionManufacturingMaintenanceSupportAnimation
                    key='animation'
                    className='size-full'
                    role='img'
                    aria-labelledby='solution-2'
                  />
                </FxPolkaDotsBackgroundEffect>
              </article>
            </section>

            <section aria-label='people are saying'>
              <h1 className='mb-24 text-center'>
                <FxGradientText preset='primary' direction='right'>
                  Here’s what people are saying about RAGFlow
                </FxGradientText>
              </h1>
              <DualRowScrollingCards
                rows={[
                  {
                    direction: 'left',
                    duration: 40,
                    items: [
                      {
                        name: 'Fabrizio Fernandez',
                        username: 'fab3304',
                        content:
                          "Testing out @ragflow's ETL.\nThis is the ETL we've all been waiting for.",
                      },
                      {
                        name: 'Felix Beaumont',
                        username: 'felixbs',
                        content:
                          "Testing out @ragflow's ETL.\nThis is the ETL we've all been waiting for.",
                      },
                      {
                        name: 'Fabrizio Fernandez',
                        username: 'fab3304',
                        content:
                          "Testing out @ragflow's ETL.\nThis is the ETL we've all been waiting for.",
                      },
                      {
                        name: 'Felix Beaumont',
                        username: 'felixbs',
                        content:
                          "Testing out @ragflow's ETL.\nThis is the ETL we've all been waiting for.",
                      },
                      {
                        name: 'Fabrizio Fernandez',
                        username: 'fab3304',
                        content:
                          "Testing out @ragflow's ETL.\nThis is the ETL we've all been waiting for.",
                      },
                      {
                        name: 'Felix Beaumont',
                        username: 'felixbs',
                        content:
                          "Testing out @ragflow's ETL.\nThis is the ETL we've all been waiting for.",
                      },
                      // ...
                    ],
                  },
                  {
                    direction: 'right', // 反向
                    duration: 45, // 独立时长
                    items: [
                      {
                        name: 'Esme Rothschild',
                        username: 'EsmeRothArt',
                        content: 'Suddenly made my side project.',
                      },
                      {
                        name: 'Esme Rothschild',
                        username: 'EsmeRothArt',
                        content: 'Suddenly made my side project.',
                      },
                      {
                        name: 'Esme Rothschild',
                        username: 'EsmeRothArt',
                        content: 'Suddenly made my side project.',
                      },
                      {
                        name: 'Esme Rothschild',
                        username: 'EsmeRothArt',
                        content: 'Suddenly made my side project.',
                      },
                      // ...
                    ],
                  },
                ]}
              />
            </section>

            {/* Pricing plans*/}
            <section aria-label='Scale Your Business' id='pricing-plan'>
              <h1 className='mb-24 text-center'>
                <FxGradientText preset='primary' direction='right'>
                  Scale Your Business
                </FxGradientText>
              </h1>

              <IndexPricingPlans />
            </section>

            {/* Get Started */}
            <section className='mt-64 text-center relative' aria-labelledby='start-building'>
              <div className='-z-10 relative h-[10vh] -mb-[10vh] translate-y-32 -translate-x-48'>
                <ThreadsBackground
                  color={PRIMARY_COLOR}
                  amplitude={0.8}
                  distance={0}
                  fixedLeftEdge={false}
                  className='absolute inset-0 size-full opacity-90'
                />
              </div>
              <header>
                <h1 id='start-building'>
                  <FxGradientText preset='primary' direction='right'>
                    Start building
                  </FxGradientText>
                </h1>
              </header>

              <div className='mt-16 flex justify-center items-center gap-8'>
                <FxGlowEffect>
                  <Link
                    className={cn(styles.btn, 'legacy-btn', 'block')}
                    to='https://cloud.ragflow.io/'
                  >
                    Get Started
                  </Link>
                </FxGlowEffect>

                <Link className='border-0 bg-standard' href='https://github.com/infiniflow/ragflow'>
                  <span>Github</span>
                </Link>
              </div>
            </section>
          </main>

          <FxEdgeInnerLightEffect className='w-[150%] min-w-[960px] h-[800px] left-1/2 -translate-x-1/2 bottom-0' />
        </div>
      </div>
    </Layout>
  );
}
