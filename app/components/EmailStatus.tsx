import { Form } from "@remix-run/react";
import { useEffect, useState } from "react";
import Button from "./Button";
import ContentContainer from "./ContentContainer";
import RefreshIcon from "./icons/mui/Refresh";
import Schedule from "./icons/mui/Schedule";
import TaskAlt from "./icons/mui/TaskAlt";
import WarningAmber from "./icons/mui/WarningAmber";
import loopGif from "~/assets/images/loader-gray-bg.gif";
import image from "~/assets/images/email-status.svg";
import type { UiStatus } from "~/email.server";

type EmailStatusProps = {
  email: string;
  currentStatus: UiStatus;
  actionPath: string;
  actionLabel: string;
};

const statusText = (status: UiStatus) => {
  return {
    request: "Die E-Mail wird gerade von unserem E-Mail-Server versendet.",
    deferred: "Die Zustellung verzögert sich.",
    delivered: "Die E-Mail wurde in Ihr Postfach zugestellt.",
    address_problem:
      "Die von Ihnen eingegebene E-Mail-Adresse scheint es nicht zu geben.",
    spam_blocker:
      "Leider konnten wir Ihnen die E-Mail nicht zustellen, da der empfangende E-Mail-Server die E-Mail fälschlicherweise als unerwünschte Werbung (Spam) eingestuft und abgelehnt hat.",
    mailbox_full:
      "Ihr E-Mail-Postfach ist voll und hat keinen Speicherplatz mehr frei – wir konnten Ihnen daher leider keine E-Mail zustellen.",
    generic_error: "Leider konnten wir Ihnen die E-Mail nicht zustellen.",
  }[status];
};

const statusTextColor = (status: UiStatus) => {
  if (status === "request") {
    return "text-black";
  } else if (status === "delivered") {
    return "text-darkGreen";
  } else {
    return "text-red-800";
  }
};

const statusIcon = (status: UiStatus) => {
  const iconProps = {
    className: "w-[1.25rem] h-[1.25rem] mt-2 mr-10 flex-shrink-0",
  };

  if (status === "request") {
    return null;
  } else if (status === "delivered") {
    return <TaskAlt {...iconProps} />;
  } else if (status === "deferred") {
    return <Schedule {...iconProps} />;
  } else {
    return <WarningAmber {...iconProps} />;
  }
};

const showStatusAction = (status: UiStatus) => {
  return !["request", "delivered", "deferred"].includes(status);
};

const showSpinner = (status: UiStatus) => {
  return ["request", "deferred"].includes(status);
};

const statusAdvice = (status: UiStatus) => {
  return {
    request: null,
    deferred:
      "Zur Spam-Vermeidung hat Ihr E-Mail-Server unsere E-Mail temporär zurückgestellt. Wir versuchen die Zustellung gleich noch einmal.",
    delivered:
      "Bitte schauen Sie in Ihr E-Mail-Postfach und klicken Sie auf den Anmeldelink in der E-Mail. Damit werden Sie angemeldet. Bitte schauen Sie in ihrem Spam-Ordner nach, falls sie die E-Mail mit den Anmeldelink nicht finden können.",
    address_problem:
      "Bitte prüfen Sie die Schreibweise und melden Sie sich dann mit der korrigierten E-Mail-Adresse erneut an.",
    spam_blocker:
      "Kontaktieren Sie Ihren E-Mail-Provider oder Ihre IT-Administration. Oder verwenden Sie eine andere E-Mail-Adresse für die Beantragung des Anmeldelinks.",
    mailbox_full:
      "Bitte geben Sie zunächst Speicherplatz frei oder erweitern Sie den Speicherplatz. Wenden Sie sich mit Fragen dazu an Ihren E-Mail-Provider oder Ihre IT-Administration. Sobald wieder Speicherplatz in Ihrem Postfach verfügbar ist, beantragen Sie erneut einen Anmeldelink mit Ihrer E-Mail-Adresse.",
    generic_error: null,
  }[status];
};

export default function EmailStatus(props: EmailStatusProps) {
  const { email, currentStatus, actionPath, actionLabel } = props;
  const [isJavaScriptEnabled, setIsJavaScriptEnabled] = useState(false);

  useEffect(() => {
    setIsJavaScriptEnabled(true);
  });

  return (
    <div className="pb-80 relative">
      <div
        className="
   hidden lg:flex justify-end absolute -right-64 top-64 w-1/2 mb-0"
      >
        <img src={image} alt="" className="w-[200%]" />
      </div>
      <div>
        <ContentContainer size="sm">
          {isJavaScriptEnabled && showSpinner(currentStatus) && (
            <div className="flex items-center mb-24">
              <img className="w-48 h-48 shrink-0 mr-16" src={loopGif} />
              <p className="italic">Bitte warten…</p>
            </div>
          )}
          <div className="mb-24 lg:hidden">
            <img src={image} alt="" />
          </div>
          <h1 className="mb-16 text-30 leading-36 md:mb-24">
            Eine E-Mail mit Anmeldelink wird versendet an:
          </h1>
        </ContentContainer>
        <p className="inline-block bg-white py-14 px-24 mb-16 md:py-20 md:mb-24">
          {email}
        </p>
        <ContentContainer size="sm">
          <div aria-live="polite">
            <div
              className={`flex ${statusTextColor(
                currentStatus
              )} mb-16 md:mb-40`}
            >
              {statusIcon(currentStatus)}
              <p>
                {statusText(currentStatus)}

                {isJavaScriptEnabled &&
                  showSpinner(currentStatus) &&
                  " Lassen Sie dieses Fenster geöffnet, bis Sie eine Bestätigung erhalten."}
              </p>
            </div>

            {!["request", "generic_error"].includes(currentStatus) && (
              <p className="mb-16 md:mb-40">{statusAdvice(currentStatus)}</p>
            )}

            {currentStatus === "generic_error" && (
              <ul className="list-disc pl-16 mb-16 md:mb-40">
                <li>Überprüfen Sie die Schreibweise der E-Mail-Adresse</li>
                <li>Melden Sie sich mit der korrigierten Adresse erneut an</li>
                <li>Verwenden Sie alternativ eine andere E-Mail-Adresse</li>
                <li>
                  Oder kontaktieren Sie Ihren E-Mail-Provider oder Ihre
                  IT-Administration.
                </li>
              </ul>
            )}

            {showStatusAction(currentStatus) && (
              <Button to={actionPath}>{actionLabel}</Button>
            )}
          </div>

          {!isJavaScriptEnabled && showSpinner(currentStatus) && (
            <>
              <p className="mb-16">
                Laden Sie die Seite neu, um zu überprüfen, ob Ihre E-Mail
                erfolgreich versendet wurde.
              </p>
              <Form reloadDocument method="get">
                <Button icon={<RefreshIcon />}>Seite aktualisieren</Button>
              </Form>
            </>
          )}
        </ContentContainer>
      </div>
    </div>
  );
}
