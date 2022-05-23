import { useTranslation } from "react-i18next";
import { MetaFunction } from "@remix-run/node";
import { BmfLogo, Button, SimplePageLayout } from "~/components";
import ArrowBackIcon from "~/components/icons/mui/ArrowBack";
import { pageTitle } from "~/util/pageTitle";

export const meta: MetaFunction = () => {
  return { title: pageTitle("Nutzungsbedingungen") };
};

export default function Nutzungsbedingungen() {
  const { t } = useTranslation("all");
  return (
    <SimplePageLayout>
      <Button
        to="/"
        look="secondary"
        icon={<ArrowBackIcon />}
        className="mb-32"
      >
        {t("termsOfUse.backButton")}
      </Button>

      <div className="mb-32 md:mb-64">
        <BmfLogo />
      </div>

      <h1 className="text-32 leading-40 mb-32 max-w-screen-sm md:text-64 md:leading-68 md:mb-48">
        {t("termsOfUse.headline")}
      </h1>
    </SimplePageLayout>
  );
}
