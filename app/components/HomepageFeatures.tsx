import { ReactNode } from "react";
import { Trans, useTranslation } from "react-i18next";
import feature1Image from "~/assets/images/feature1.svg";
import feature2Image from "~/assets/images/feature2.svg";
import feature3Image from "~/assets/images/feature3.svg";

type HomepageFeatureProps = {
  children: ReactNode;
  headline: string;
  image: string;
};

function HomepageFeature(props: HomepageFeatureProps) {
  const { children, headline, image } = props;
  return (
    <div className="flex flex-col">
      <img
        src={image}
        alt=""
        role="presentation"
        className="w-full"
        width={312}
        height={182}
        loading="lazy"
      />
      <div className="flex-grow bg-blue-300 p-32 rounded-b-md border-t-gray-800 border-t-4">
        <h2 className="text-20 leading-26 mb-24">{headline}</h2>
        {children}
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  const { t } = useTranslation("all");
  return (
    <div className="grid grid-cols-1 md:auto-rows-fr gap-x-24 gap-y-48 md:grid-cols-2 lg:grid-cols-3">
      <HomepageFeature
        headline={t("homepage.features.1.headline")}
        image={feature1Image}
      >
        <p>
          <Trans components={{ bold: <strong /> }}>
            {t("homepage.features.1.text")}
          </Trans>
        </p>
      </HomepageFeature>
      <HomepageFeature
        headline={t("homepage.features.2.headline")}
        image={feature2Image}
      >
        <p className="mb-24">{t("homepage.features.2.text1")}</p>
        <ul className="mb-24 list-disc pl-24">
          <li>
            <Trans components={{ bold: <strong /> }}>
              {t("homepage.features.2.listItem1")}
            </Trans>
          </li>
          <li>
            <Trans components={{ bold: <strong /> }}>
              {t("homepage.features.2.listItem2")}
            </Trans>
          </li>
          <li>{t("homepage.features.2.listItem3")}</li>
        </ul>
        <p>{t("homepage.features.2.text2")}</p>
      </HomepageFeature>
      <HomepageFeature
        headline={t("homepage.features.3.headline")}
        image={feature3Image}
      >
        <p className="mb-24">{t("homepage.features.3.text1")}</p>
        <ul className="mb-24 font-bold list-disc pl-24">
          <li>{t("homepage.features.3.listItem1")}</li>
          <li>{t("homepage.features.3.listItem2")}</li>
          <li>{t("homepage.features.3.listItem3")}</li>
        </ul>
        <p>{t("homepage.features.3.text2")}</p>
      </HomepageFeature>
    </div>
  );
}
