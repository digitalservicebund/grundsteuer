import { useTranslation } from "react-i18next";
import { SimplePageLayout } from "~/components";

export default function DataProtection() {
  const { t } = useTranslation("all");
  return (
    <SimplePageLayout>
      <h1>{t("dataProtection.headline")}</h1>
    </SimplePageLayout>
  );
}
