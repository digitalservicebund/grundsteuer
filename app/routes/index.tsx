import { useTranslation } from "react-i18next";
import { Link } from "remix";
import { ContentContainer, SimplePageLayout } from "~/components";

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
        <h1 className="mb-64 md:mb-96 lg:mb-64">
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

        <Link
          to="/formular/grundstueck/adresse"
          className="text-32 underline text-blue-800"
          data-testid="start-formular"
        >
          Fragebogen
        </Link>
      </SimplePageLayout>
    </>
  );
}
