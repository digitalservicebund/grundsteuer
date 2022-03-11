import { useTranslation } from "react-i18next";
import { SimplePageLayout } from "~/components";

export default function Imprint() {
  const { t } = useTranslation("all");
  return (
    <SimplePageLayout>
      <h1>{t("imprint.headline")}</h1>
    </SimplePageLayout>
  );
}
