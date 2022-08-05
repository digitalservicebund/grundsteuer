import { LoaderFunction } from "@remix-run/node";
import { useTranslation } from "react-i18next";
import {
  ContentContainer,
  FaqAccordion,
  HomepageFeatures,
  Footer,
  BmfLogo,
  BreadcrumbNavigation,
} from "~/components";
import germanyMapImage from "~/assets/images/germany-map.svg";
import HomepageSharing from "~/components/HomepageSharing";
import { HomepageHeader } from "~/components/navigation/HomepageHeader";

export const loader: LoaderFunction = async () => {
  return {};
};

export default function Index() {
  const { t } = useTranslation("all");

  return (
    <>
      {/*<div className="flex-shrink-0 bg-yellow-300 border-l-[9px] border-l-yellow-500 py-16">
        <ContentContainer>
          <p className="text-14 leading-20 lg:text-18 lg:leading-24">
          </p>
        </ContentContainer>
      </div> */}
      <HomepageHeader />
      <main className="flex-grow">
        <BreadcrumbNavigation />
        <ContentContainer>
          <BmfLogo />
          <h1 className="mb-64 md:mb-96 xl:mb-80">
            <div className="text-16 leading-26 mb-16 md:text-20 md:leading-20 md:mb-24 lg:mb-32">
              {t("homepage.kicker")}
            </div>
            <div className="max-w-[300px] text-32 leading-40 mb-8 md:max-w-[560px] md:text-[3.5rem] md:leading-68 md:mb-24 lg:text-64 lg:mb-8">
              {t("homepage.headline")}
            </div>
            <div className="text-20 leading-26 md:text-28 md:leading-26 lg:text-32 lg:leading-40">
              {t("homepage.tagline")}
            </div>
          </h1>

          <div className="mb-64 md:mb-80 lg:mb-96">
            <HomepageFeatures />
          </div>

          <div className="mb-64 md:max-w-screen-sm md:mb-32 lg:max-w-screen-md">
            <h2 className="text-32 leading-40 mb-16">
              {t("homepage.about.headline")}
            </h2>
            <p className="mb-24">{t("homepage.about.text1")}</p>
            <p className="font-bold">{t("homepage.about.text2")}</p>
          </div>

          <div
            className="mb-64 md:mb-24 flex flex-col md:flex-row"
            id="teilnehmende-bundeslaender"
          >
            <div className="mb-32 md:mb-0 lg:pt-64">
              <h2 className="text-32 leading-40 mb-16">
                {t("homepage.states.headline")}
              </h2>
              <p className="mb-24">{t("homepage.states.text")}</p>
              <div className="font-bold md:flex">
                <ul className="list-disc pl-24">
                  <li>Berlin</li>
                  <li>Brandenburg</li>
                  <li>Bremen</li>
                  <li>Mecklenburg-Vorpommern</li>
                  <li>Nordrhein-Westfalen</li>
                  <li>Rheinland-Pfalz</li>
                </ul>
                <ul className="list-disc pl-24 md:ml-24">
                  <li>Saarland</li>
                  <li>Sachsen</li>
                  <li>Sachsen-Anhalt</li>
                  <li>Schleswig-Holstein</li>
                  <li>Thüringen</li>
                </ul>
              </div>
            </div>
            <img
              src={germanyMapImage}
              alt={t("homepage.states.mapAlt")}
              aria-describedby="teilnehmende-bundeslaender"
              className="mx-auto md:ml-48 lg:ml-112 xl:ml-176"
              width={255}
              height={391}
            />
          </div>

          <div className="mb-64" id="faq">
            <h2 className="text-32 leading-40 mb-16 md:mb-32">
              {t("homepage.faq.headline")}
            </h2>
            <div className="xl:pr-96">
              <FaqAccordion />
            </div>
          </div>

          <div className="mb-0 md:mb-80">
            <h2 className="text-32 leading-40 mb-16 md:mb-32">
              {t("homepage.sharing.headline")}
            </h2>
            <HomepageSharing />
          </div>
        </ContentContainer>
      </main>
      <Footer />
    </>
  );
}
