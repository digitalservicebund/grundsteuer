import { Button } from "~/components/index";
import { useTranslation } from "react-i18next";
import steuerlotseImg from "~/assets/images/mock-up-steuerlotse.png";

export default function HomepageCrossPromo() {
  const { t } = useTranslation("all");

  return (
    <div className="flex flex-col md:flex-row">
      <div className="flex flex-col xl:flex-row">
        <h2 className="text-30 leading-36 mb-32 md:mr-32 min-w-[240px] w-[240px]">
          {t("homepage.steuerlotse.headline")}
        </h2>
        <div className="mb-32">
          <p className="mb-24 max-w-[378px]">
            {t("homepage.steuerlotse.paragraph")}
          </p>
          <Button
            href="https://www.steuerlotse-rente.de?ref=grundsteuer"
            target="_blank"
            rel="noopener"
            look="tertiary"
            size="medium"
          >
            {t("homepage.steuerlotse.buttonText")}
          </Button>
        </div>
      </div>
      <div className="flex flex-col justify-end">
        <img
          src={steuerlotseImg}
          alt=""
          className="max-w-[410px]"
          width={820}
          height={449}
          loading="lazy"
        />
      </div>
    </div>
  );
}
