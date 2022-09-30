import { useTranslation } from "react-i18next";
import {
  BmfLogo,
  BreadcrumbNavigation,
  Button,
  ContentContainer,
  FaqAccordion,
  Footer,
  HomepageAction,
  HomepageFeatures,
} from "~/components";
import germanyMapImage from "~/assets/images/germany-map.svg";
import { HomepageHeader } from "~/components/navigation/HomepageHeader";
import HelpInfoBox from "~/components/HelpInfoBox";
import Edit from "~/components/icons/mui/Edit";

export default function Index() {
  const { t } = useTranslation("all");

  return (
    <>
      {/*<div className="flex-shrink-0 bg-yellow-300 border-l-[9px] border-l-yellow-500 py-16">
        <ContentContainer>
          <p className="text-14 leading-20 lg:text-18 lg:leading-24">
            Für Eigentümer:innen einer Eigentumswohnung mit Garage in
            Nordrhein-Westfalen: aktuell kann aus technischen Gründen die
            Grundbuchblattnummer nicht angegeben werden. Wir arbeiten an einer
            Lösung.
          </p>
        </ContentContainer>
      </div> */}
      <HomepageHeader />
      <main className="flex-grow">
        <BreadcrumbNavigation />
        <ContentContainer>
          <BmfLogo />
          <div className="mb-64 md:mb-96 xl:mb-80">
            <h1>
              <div className="max-w-[300px] text-32 leading-40 mb-8 mt-18 sm:max-w-[560px] sm:text-[3.5rem] sm:leading-68 md:mb-24 lg:text-64 lg:mb-8">
                {t("homepage.headline")}
              </div>
              <div className="text-20 leading-26 sm:text-28 sm:leading-26 lg:text-32 lg:leading-40">
                {t("homepage.tagline")}
              </div>
            </h1>
            <Button
              className={"w-full max-w-[44ch] mt-32 sm:mt-40"}
              to="/pruefen/start"
            >
              {t("homepage.start")}
            </Button>
            <div className="max-w-[250px] leading-26 sm:max-w-[420px] lg:leading-40 mt-32 sm:mt-64">
              <h3 className="text-20 leading-26 mb-8 sm:text-24">
                {t("homepage.continue.headline")}
              </h3>
              <p className="text-18 leading-26 mb-16">
                {t("homepage.continue.text")}
              </p>
            </div>
            <Button
              look={"ghost"}
              size={"large"}
              icon={<Edit />}
              className={"underline pl-0"}
              to="/anmelden"
            >
              {t("homepage.continue.buttonText")}
            </Button>
          </div>

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

          <div className="mb-80" id="faq">
            <h2 className="text-32 leading-40 mb-16 md:mb-32">
              {t("homepage.faq.headline")}
            </h2>
            <div className="xl:pr-96">
              <HelpInfoBox />
            </div>
            <div className="xl:pr-96">
              <FaqAccordion />
            </div>
          </div>

          <div className="mb-0 md:mb-160 xl:pr-96">
            <h2 className="text-32 leading-40 mb-32 md:mb-64">
              {t("homepage.action.headline")}
            </h2>
            <HomepageAction />
          </div>
        </ContentContainer>
      </main>
      <Footer />
    </>
  );
}
