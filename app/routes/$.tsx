import { Trans, useTranslation } from "react-i18next";
import { Button, SimplePageLayout } from "~/components";
import { LoaderFunction, MetaFunction } from "@remix-run/node";
import ArrowBackIcon from "~/components/icons/mui/ArrowBack";
import { pageTitle } from "~/util/pageTitle";
import illustrationImage from "~/assets/images/404.svg";

export const loader: LoaderFunction = () => {
  // creating this catch-all route and letting it throw an 404
  // is a workaround for:
  // https://github.com/sergiodxa/remix-i18next/issues/33
  throw new Response("Page missing", { status: 404 });
};

export const meta: MetaFunction = () => {
  return { title: pageTitle("Fehler 404") };
};

export default function CatchAllRoute() {
  return null;
}

export function CatchBoundary() {
  const { t } = useTranslation("all");
  return (
    <SimplePageLayout>
      <Button
        to="/"
        look="secondary"
        icon={<ArrowBackIcon />}
        className="mb-64 md:mb-80"
      >
        {t("404.backButton")}
      </Button>

      <h1 className="text-32 leading-40 mb-32 max-w-screen-sm md:text-64 md:leading-68 md:mb-48">
        404
        <br />
        {t("404.headline")}
      </h1>

      <p className="text-20 leading-26 md:text-32 md:leading-40 max-w-screen-md mb-24 md:mb-32">
        {t("404.text")}
      </p>

      <p className="max-w-screen-md mb-64 md:mb-96">
        <Trans
          components={{
            bold: <strong />,
            nowrap: <span className="whitespace-nowrap" />,
          }}
        >
          {t("404.smallprint")}
        </Trans>
      </p>

      <img
        src={illustrationImage}
        alt=""
        role="presentation"
        className="mb-80 md:mb-160"
      />
    </SimplePageLayout>
  );
}
