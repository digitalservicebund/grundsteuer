import UhrIcon from "~/assets/images/icon_uhr.svg";
import Button from "~/components/Button";
import { useTranslation } from "react-i18next";

export default function TeaserBox() {
  const { t } = useTranslation("all");
  return (
    <div
      className={
        "bg-white flex flex-col items-stretch md:flex-row items-center py-32 pl-64 pr-64 mb-32 border-t-4 border-gray-800"
      }
    >
      <img
        src={UhrIcon}
        alt="Person sitzt vor grüner Uhr und stellt diese auf 8 Uhr 18 ein."
        className="relative w-[160px] md:w-[200px] lg:w-[230px] lg:mr-48 mb-32 lg:mb-0"
        width={230}
        height={217}
      />
      <div className="flex flex-col">
        <h2 className="text-20 leading-26 mb-24">
          {t("homepage.teaser.headline")}
        </h2>
        <p className="grow mb-16 lg:mb-12">{t("homepage.teaser.text")}</p>
        <Button
          size="large"
          look={"tertiary"}
          href={
            "https://grundsteuererklaerung-fuer-privateigentum.zammad.com/help/de-de/28-fragen-zur-abgabefrist-31-januar-2023"
          }
          target={"_blank"}
          className={"w-288"}
        >
          {t("homepage.teaser.linkText")}
        </Button>
      </div>
    </div>
  );
}
