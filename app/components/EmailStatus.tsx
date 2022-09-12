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

type Status =
  | "sent"
  | "deferred"
  | "delivered"
  | "address_problem"
  | "spam_blocker"
  | "mailbox_full"
  | "generic_error";

type EmailStatusProps = {
  email: string;
  currentStatus: Status;
  actionPath: string;
  actionLabel: string;
};

const statusText = (status: Status) => {
  return {
    sent: "Die E-Mail wird von unserem E-Mail Server versendet.",
    deferred: "Die Zustellung verzögert sich. ",
    delivered: "Die E-Mail wurde in Ihr Postfach zugestellt.",
    address_problem:
      "Die von Ihnen eingegebene E-Mail-Adresse existiert nicht.",
    spam_blocker:
      "Leider konnten wir Ihnen die E-Mail nicht zustellen, da der empfangende Mailserver die E-Mail fälschlicherweise als unerwünschte Werbung (Spam) eingestuft und abgelehnt hat.",
    mailbox_full:
      "Ihr E-Mail-Postfach ist voll und hat keinen Speicherplatz mehr – wir konnten Ihnen leider keine E-Mail zustellen.",
    generic_error: "Leider konnten wir Ihnen die E-Mail nicht zustellen.",
  }[status];
};

const statusTextColor = (status: Status) => {
  if (status === "sent") {
    return "text-black";
  } else if (status === "delivered") {
    return "text-darkGreen";
  } else {
    return "text-red-800";
  }
};

const statusIcon = (status: Status) => {
  const iconProps = {
    className: "w-[1.25rem] h-[1.25rem] mt-2 mr-10 flex-shrink-0",
  };

  if (status === "sent") {
    return null;
  } else if (status === "delivered") {
    return <TaskAlt {...iconProps} />;
  } else if (status === "deferred") {
    return <Schedule {...iconProps} />;
  } else {
    return <WarningAmber {...iconProps} />;
  }
};

const showStatusAction = (status: Status) => {
  return !["sent", "delivered", "deferred"].includes(status);
};

const showSpinner = (status: Status) => {
  return ["sent", "deferred"].includes(status);
};

const statusAdvice = (status: Status) => {
  return {
    sent: null,
    deferred:
      "Zur Spam-Vermeidung hat Ihr E-Mail-Server unsere E-Mail temporär zurückgestellt.",
    delivered:
      "Bitte schauen Sie in Ihr E-Mail Postfach und klicken Sie auf den Link in der E-Mail. Damit werden Sie angemeldet. Bitte schauen Sie in ihrem Spam-Ordner nach, falls sie den Anmeldelink nicht finden können.",
    address_problem:
      "Bitte prüfen Sie die Schreibweise und melden Sie sich dann mit der korrigierten Adresse erneut an.",
    spam_blocker:
      "Kontaktieren Sie Ihren E-Mail-Provider bzw. Ihre IT-Administration oder verwenden Sie eine andere E-Mailadresse für die Beantragung des Anmeldelinks.",
    mailbox_full:
      "Bitte geben Sie zunächst Speicherplatz frei oder erweitern Sie den Speicherplatz. Melden Sie sich danach erneut an. Wenden Sie sich mit Fragen dazu an Ihren E-Mail-Provider oder Ihre IT-Administration. Wenn Speicherplatz für Ihr Postfach freigegeben ist, beantragen Sie erneut einen Anmeldlink mit Ihrer E-Mailadresse.",
    generic_error:
      "Bitte prüfen Sie die Schreibweise der E-Mail-Adresse und melden Sie sich dann ggf. mit der korrigierten Adresse erneut an. Wenn die E-Mail trotz korrekter Schreibweise nicht ankommt, verwenden Sie bitte eine andere Adresse oder kontaktieren Sie Ihren E-Mail-Provider oder Ihre IT-Administration.",
  }[status];
};

export default function EmailStatus(props: EmailStatusProps) {
  const { email, currentStatus, actionPath, actionLabel } = props;
  const [isJavaScriptEnabled, setIsJavaScriptEnabled] = useState(false);

  useEffect(() => {
    setIsJavaScriptEnabled(true);
  });

  return (
    <div className="pb-80 relative overflow-hidden">
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
                  "Lassen Sie dieses Fenster geöffnet, bis Sie eine Bestätigung erhalten."}
              </p>
            </div>

            {currentStatus !== "sent" && (
              <p className="mb-16 md:mb-40">{statusAdvice(currentStatus)}</p>
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
