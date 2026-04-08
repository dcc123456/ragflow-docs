import Layout from "@theme/Layout";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

import Icon from "@site/src/components/Icon";

import FxGradientText from "@site/src/utils/visual-effects/FxGradientText";
import FxEdgeInnerLightEffect from "@site/src/utils/visual-effects/FxEdgeInnerLightEffect";
import FxSpotlightEffect from "@site/src/utils/visual-effects/FxSpotlight";
import FxRecolorIcon from "@site/src/utils/visual-effects/FxRecolorIcon";
import { useTranslations } from "@site/src/utils/useTranslations";

import { cn } from "@site/src/utils/twUtils";

import IMG_BANNER from "@site/src/assets/img/solutions/finance/banner.png";

import IMG_1 from "@site/src/assets/img/solutions/finance/1.png";
import IMG_2 from "@site/src/assets/img/solutions/finance/2.png";
import IMG_3 from "@site/src/assets/img/solutions/finance/3.png";
import IMG_4 from "@site/src/assets/img/solutions/finance/4.png";

import styles from "./index.module.scss";
import commonStyles from "../index.module.scss";

const FEATURES = [
  { img: IMG_1, titleKey: "feature1Title", itemsKey: "feature1Items" },
  { img: IMG_2, titleKey: "feature2Title", itemsKey: "feature2Items" },
  { img: IMG_3, titleKey: "feature3Title", itemsKey: "feature3Items" },
  { img: IMG_4, titleKey: "feature4Title", itemsKey: "feature4Items" },
];

const USE_CASES = [
  {
    icon: "RagResearch",
    titleKey: "useCase1Title",
    descKey: "useCase1Description",
  },
  {
    icon: "RagSales",
    titleKey: "useCase2Title",
    descKey: "useCase2Description",
  },
  {
    icon: "RagPost",
    titleKey: "useCase3Title",
    descKey: "useCase3Description",
  },
  {
    icon: "RagCompliance",
    titleKey: "useCase4Title",
    descKey: "useCase4Description",
  },
];

export default function PageAdvancedStockResearch() {
  const { t, getItems } = useTranslations("financialServices");

  return (
    <Layout
      title={t("pageTitle")}
      description={t("pageDescription")}
      wrapperClassName={styles.page}
    >
      <div className="relative container max-desktop:px-page text-standard text-sm mobile:text-base pb-64">
        <header className="relative py-36 text-center">
          <div
            className="absolute -z-10 inset-0 top-36 h-full min-w-full"
            inert
          >
            <img
              role="presentation"
              src={IMG_BANNER}
              className="opacity-100 object-contain size-auto h-full"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-bg-standard/80 to-transparent" />
          </div>

          <h1 className="mb-8 xl:mb-12 text-4xl">
            <FxGradientText preset="primary" direction="right">
              {t("headerTitle")}
            </FxGradientText>
          </h1>

          <p className="text-xl xl:text-2xl xl:!leading-loose">
            {t("headerSubtitle")}
          </p>
        </header>

        <main className="mt-12 relative z-10">
          <FxSpotlightEffect className="w-[200%] min-w-[960px] h-[520px] left-1/2 -translate-x-1/2 top-8 -translate-y-1/2 opacity-10" />

          <div className="space-y-48">
            <div className="flex flex-col gap-20 xl:grid xl:grid-cols-2 xl:gap-y-28">
              {FEATURES.map((feature) => (
                <article key={feature.titleKey} className="flex gap-4">
                  <div className="w-44 desktop:w-48 xl:w-1/3 flex-none hidden md:block">
                    <img
                      className="w-full object-contain object-center aspect-1"
                      src={feature.img}
                      role="presentation"
                    />
                  </div>

                  <div className="flex-1">
                    <header>
                      <h2 className="text-xl">
                        <FxGradientText preset="primary" direction="right">
                          {t(feature.titleKey)}
                        </FxGradientText>
                      </h2>
                    </header>

                    <ul className="text-sm leading-6">
                      {getItems(feature.itemsKey).map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>

            <section aria-labelledby="use-cases">
              <header className="text-center mb-32">
                <h1 id="use-cases" className="text-5xl">
                  <FxGradientText preset="primary" direction="right">
                    {t("useCasesTitle")}
                  </FxGradientText>
                </h1>
              </header>

              <div className="grid grid-cols-1 gap-12 xl:grid-cols-2 xl:gap-20 xl:px-36">
                {USE_CASES.map((useCase) => (
                  <article
                    key={useCase.titleKey}
                    className={cn(commonStyles.card, "bg-transparent")}
                  >
                    <header>
                      <h2 className="flex flex-col gap-4 text-base font-medium">
                        <FxRecolorIcon
                          to="bottom"
                          stops={[
                            [0, "#fff"],
                            [1, "#888"],
                          ]}
                        >
                          <Icon
                            icon={useCase.icon as any}
                            className="size-12 text-[3rem] stroke-1"
                          />
                        </FxRecolorIcon>

                        <span>{t(useCase.titleKey)}</span>
                      </h2>
                    </header>

                    <p className="text-sm">{t(useCase.descKey)}</p>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </main>

        <FxEdgeInnerLightEffect
          position="bottom"
          className="absolute w-[150%] min-w-[960px] h-[600px] left-1/2 bottom-0 -translate-x-1/2"
        />
      </div>
    </Layout>
  );
}
