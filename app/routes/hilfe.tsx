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
import { commitSession, getSession } from "~/session.server";

export const BACKLINK_URL_KEY = "backLinkUrl";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  return json(
    {
      i18n: await getStepI18n("hilfe"),
      backLinkUrl: session.get(BACKLINK_URL_KEY),
    },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    }
  );
};

export default function Hilfe() {
  const loaderData = useLoaderData();
  const { backLinkUrl, i18n } = loaderData;
  return (
    <UserLayout>
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
                  href="mailto:kontakt@grundsteuererklärung-fuer-privateigentum.de"
                />
              ),
            }}
          >
            {i18n.emailText}
          </Trans>
        </TextParagraph>
        <TextParagraph>{i18n.emailSubjectText}</TextParagraph>
        <TextParagraph>{i18n.legalNote}</TextParagraph>

        <Button look="primary" icon={<ArrowBackIcon />} to={backLinkUrl}>
          Zurück
        </Button>
      </ContentContainer>
    </UserLayout>
  );
}
