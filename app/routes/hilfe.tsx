import {
  BreadcrumbNavigation,
  ContentContainer,
  Headline,
  UserLayout,
} from "~/components";
import { getStepI18n } from "~/i18n/getStepI18n";
import ArrowBackIcon from "~/components/icons/mui/ArrowBack";
import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Button from "~/components/Button";
import TextParagraph from "~/components/TextParagraph";
import { Trans } from "react-i18next";

export const loader: LoaderFunction = async () => {
  return json({
    i18n: await getStepI18n("hilfe"),
    isProduction: process.env.NODE_ENV === "production",
  });
};

export default function Hilfe() {
  const loaderData = useLoaderData();
  const { i18n, isProduction } = loaderData;
  return (
    <UserLayout disableLogin={isProduction}>
      <ContentContainer size="sm">
        <BreadcrumbNavigation />
        <div className="sm:max-w-[412px]">
          <Headline>{i18n.headline}</Headline>
        </div>

        <TextParagraph>
          <Trans components={{ lineBreak: <br /> }}>{i18n.intro}</Trans>
        </TextParagraph>
        <TextParagraph>
          <Trans
            components={{
              emailContactLink: (
                <a
                  className="text-blue-900"
                  href="mailto:kontakt@grundsteuererklaerung-fuer-privateigentum.de"
                />
              ),
            }}
          >
            {i18n.emailText}
          </Trans>
        </TextParagraph>
        <TextParagraph>{i18n.emailSubjectText}</TextParagraph>
        <TextParagraph>{i18n.legalNote}</TextParagraph>

        <Button
          look="primary"
          icon={<ArrowBackIcon />}
          onClick={() => history.back()}
        >
          Zurück
        </Button>
      </ContentContainer>
    </UserLayout>
  );
}
