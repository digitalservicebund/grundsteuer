import { Trans } from "react-i18next";
import { Button, SimplePageLayout } from "~/components";
import illustrationImage404 from "~/assets/images/404.svg";
import illustrationImage500 from "~/assets/images/500.svg";

type ErrorPageProps = {
  statusCode: 404 | 500;
};

const texts = {
  404: {
    backButton: "Zur Startseite",
    headline: "Seite konnte nicht gefunden werden.",
    body: "Es tut uns leid. Diese Seite scheint es nicht zu geben. Sie wurde vielleicht entfernt, im Namen geändert oder ist auf andere Weise nicht erreichbar.",
    smallprint:
      "Wenn Sie die URL direkt eingegeben haben, überprüfen Sie die Schreibweise.",
  },
  500: {
    backButton: "Zur Startseite",
    headline: "Ein unerwarteter Fehler ist aufgetreten.",
    body: "Es tut uns leid! Ein Fehler ist aufgetreten. Bitte laden Sie die Seite neu oder versuchen Sie es zu einem anderen Zeitpunkt noch einmal. ",
  },
};

export default function ErrorPage(props: ErrorPageProps) {
  const { statusCode } = props;

  return (
    <SimplePageLayout>
      <h1 className="text-32 leading-40 mb-32 max-w-screen-sm md:text-64 md:leading-68 md:mb-48">
        {statusCode}
        <br />
        {texts[statusCode].headline}
      </h1>

      <p className="text-20 leading-26 md:text-32 md:leading-40 max-w-screen-md mb-24 md:mb-32">
        {texts[statusCode].body}
      </p>

      {statusCode === 404 && (
        <p className="max-w-screen-md mb-64 md:mb-96">
          <Trans
            components={{
              bold: <strong />,
              nowrap: <span className="whitespace-nowrap" />,
            }}
          >
            {texts[statusCode].smallprint}
          </Trans>
        </p>
      )}

      <Button to="/formular" className="mb-64">
        {texts[statusCode].backButton}
      </Button>

      <img
        src={statusCode === 404 ? illustrationImage404 : illustrationImage500}
        alt=""
        role="presentation"
        className="mb-80 md:mb-160"
      />
    </SimplePageLayout>
  );
}
