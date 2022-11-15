import { Trans } from "react-i18next";
import { useLocation } from "react-router-dom";
import { Button, SimplePageLayout } from "~/components";
import illustrationImage404 from "~/assets/images/404.svg";
import illustrationImage500 from "~/assets/images/500.svg";
import RefreshIcon from "./icons/mui/Refresh";

type ErrorPageProps = {
  statusCode: number;
  statusText?: string;
};

type Texts = Record<
  number,
  { backButton?: string; headline: string; body: string; smallprint?: string }
>;

const texts: Texts = {
  404: {
    backButton: "Zur Startseite",
    headline: "Seite konnte nicht gefunden werden.",
    body: "Es tut uns leid. Diese Seite scheint es nicht zu geben. Sie wurde vielleicht entfernt, im Namen geändert oder ist auf andere Weise nicht erreichbar.",
    smallprint:
      "Wenn Sie die URL direkt eingegeben haben, überprüfen Sie die Schreibweise.",
  },
  400: {
    headline: "Übertragungsfehler",
    body: "Es tut uns leid. Bei der Datenübertragung zum Server ist etwas schief gelaufen. Der Server konnte die Anfrage daher nicht bearbeiten. Bitte laden Sie die Seite neu und versuchen Sie es erneut.",
  },
  429: {
    // TODO change to "reload" button?
    backButton: "Zur Startseite",
    headline: "Es gab zu viele Anfragen.",
    body: "Es tut uns leid. Für diese Seite scheint es in letzter Zeit von Ihrer IP-Adresse zu viele Anfragen gegeben haben. Bitte warten Sie eine Minute und probieren Sie es dann erneut.",
  },
  500: {
    backButton: "Zur Startseite",
    headline: "Ein unerwarteter Fehler ist aufgetreten.",
    body: "Es tut uns leid! Ein Fehler ist aufgetreten. Bitte laden Sie die Seite neu oder versuchen Sie es zu einem anderen Zeitpunkt noch einmal. ",
  },
};

export default function ErrorPage(props: ErrorPageProps) {
  const { statusCode, statusText } = props;

  const currentLocation = useLocation();

  const statusCodeTexts =
    statusCode in texts
      ? texts[statusCode]
      : {
          headline: statusText || "Es ist ein Fehler aufgetreten.",
          body: "",
          backButton: "Zur Startseite",
        };

  return (
    <SimplePageLayout>
      <h1 className="text-32 leading-40 mb-32 max-w-screen-sm md:text-64 md:leading-68 md:mb-48">
        {statusCode}
        <br />
        {statusCodeTexts.headline}
      </h1>

      <p className="text-20 leading-26 md:text-32 md:leading-40 max-w-screen-md mb-24 md:mb-32">
        {statusCodeTexts.body}
      </p>

      {statusCodeTexts.smallprint && (
        <p className="max-w-screen-md mb-64 md:mb-96">
          <Trans
            components={{
              bold: <strong />,
              nowrap: <span className="whitespace-nowrap" />,
            }}
          >
            {statusCodeTexts.smallprint}
          </Trans>
        </p>
      )}

      {statusCodeTexts.backButton && statusCode !== 429 && (
        <Button to="/formular" className="mb-64">
          {statusCodeTexts.backButton}
        </Button>
      )}

      {statusCode === 429 && (
        <Button
          to={currentLocation.pathname}
          icon={<RefreshIcon />}
          className="mb-64"
        >
          Seite aktualisieren
        </Button>
      )}

      <img
        src={statusCode === 404 ? illustrationImage404 : illustrationImage500}
        alt=""
        role="presentation"
        className="mb-80 md:mb-160"
      />
    </SimplePageLayout>
  );
}
