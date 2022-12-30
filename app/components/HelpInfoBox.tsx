import FallschirmIcon from "~/assets/images/icon_fallschirm.svg";
import OpenTab from "~/components/icons/mui/OpenTab";
import Button from "~/components/Button";
import { useTranslation } from "react-i18next";

export default function HelpInfoBox() {
  const { t } = useTranslation("all");
  return (
    <div
      className={
        "bg-blue-300 flex flex-col items-stretch md:flex-row items-center py-32 pl-64 pr-64 mb-32"
      }
    >
      <img
        src={FallschirmIcon}
        alt="Person segelt am Fallschirm durch Wolken"
        className="relative w-[160px] md:w-[200px] lg:w-[230px] lg:mr-48 mb-32 lg:mb-0"
        width={230}
        height={217}
        loading="lazy"
      />
      <div className="flex flex-col">
        <h2 className="text-20 leading-26 mb-24">
          {t("homepage.helpInfoBox.headline")}
        </h2>
        <p className="grow mb-16 lg:mb-0">{t("homepage.helpInfoBox.text")}</p>
        <Button
          size="large"
          look={"tertiary"}
          href={
            "https://grundsteuererklaerung-fuer-privateigentum.zammad.com/help/de-de"
          }
          target={"_blank"}
          iconRight={<OpenTab />}
          className={"w-288"}
        >
          {t("homepage.helpInfoBox.linkText")}
        </Button>
      </div>
    </div>
  );
}
