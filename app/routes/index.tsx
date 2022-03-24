import { useTranslation } from "react-i18next";
import {
  BmfLogo,
  Button,
  ContentContainer,
  FaqAccordion,
  HomepageFeatures,
  SimplePageLayout,
} from "~/components";
import germanyMapImage from "~/assets/images/germany-map.svg";
import HomepageSharing from "~/components/HomepageSharing";

export default function Index() {
  const { t } = useTranslation("all");
  return (
    <>
      <div className="flex-shrink-0 bg-yellow-300 border-l-[9px] border-l-yellow-500 py-16 lg:py-28">
        <ContentContainer>
          <div className="text-20 leading-26 lg:text-32 lg:leading-40">
            {t("homepage.banner")}
          </div>
        </ContentContainer>
      </div>
      <SimplePageLayout>
        <div className="mb-10 md:mb-48 lg:mb-36 flex flex-col md:flex-row-reverse md:justify-between">
          <div className="flex justify-center mb-40 md:block">
            <div className="lg:hidden inline-flex flex-col md:flex-row md:pt-32">
              <Button
                size="medium"
                look="tertiary"
                disabled
                className="mb-16 text-center md:mb-0 md:mr-24"
              >
                {t("homepage.buttonCheck")}
              </Button>
              <Button size="medium" disabled>
                {t("homepage.buttonStart")}
              </Button>
            </div>
            <div className="hidden lg:block pt-16">
              <Button look="tertiary" disabled className="mr-24">
                {t("homepage.buttonCheck")}
              </Button>
              <Button disabled>{t("homepage.buttonStart")}</Button>
            </div>
          </div>
          <div>
            <BmfLogo />
          </div>
        </div>

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
          <h3 className="text-32 leading-40 mb-16">
            {t("homepage.about.headline")}
          </h3>
          <p className="mb-24">{t("homepage.about.text1")}</p>
          <p className="font-bold">{t("homepage.about.text2")}</p>
        </div>

        <div
          className="mb-64 md:mb-24 flex flex-col md:flex-row"
          id="teilnehmende-bundeslaender"
        >
          <div className="mb-32 md:mb-0 lg:pt-64">
            <h3 className="text-32 leading-40 mb-16">
              {t("homepage.states.headline")}
            </h3>
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
          />
        </div>

        <div className="mb-64" id="faq">
          <h3 className="text-32 leading-40 mb-16 md:mb-32">
            {t("homepage.faq.headline")}
          </h3>
          <div className="xl:pr-96">
            <FaqAccordion />
          </div>
        </div>

        <div className="mb-64 md:mb-32">
          <h3 className="text-32 leading-40 mb-16 md:mb-32">
            {t("homepage.sharing.headline")}
          </h3>
          <HomepageSharing />
        </div>
      </SimplePageLayout>
    </>
  );
}
