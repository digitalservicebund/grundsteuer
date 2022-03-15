import { useTranslation } from "react-i18next";
import {
  Button,
  ContentContainer,
  HomepageFeatures,
  SimplePageLayout,
} from "~/components";
import bmfLogoImage from "~/assets/images/bmf-logo.png";

export default function Index() {
  const { t } = useTranslation("all");
  return (
    <>
      <div className="flex-shrink-0 bg-yellow-200 border-l-[9px] border-l-yellow-500 py-16">
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
              <Button size="medium" to="/formular/grundstueck/adresse">
                {t("homepage.buttonStart")}
              </Button>
            </div>
            <div className="hidden lg:block pt-16">
              <Button look="tertiary" disabled className="mr-24">
                {t("homepage.buttonCheck")}
              </Button>
              <Button to="/formular/grundstueck/adresse">
                {t("homepage.buttonStart")}
              </Button>
            </div>
          </div>
          <div>
            <div className="ml-8 text-10 leading-13 md:ml-0 md:text-16 md:leading-26 lg:mt-16">
              {t("homepage.bmfLogoTopline")}
            </div>
            <img
              src={bmfLogoImage}
              alt={t("homepage.bmfLogoAlt")}
              className="relative -left-16 w-[192px] md:-left-24 md:w-[218px] lg:-left-36 lg:w-[298px]"
            />
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
      </SimplePageLayout>
    </>
  );
}
