import { defaultProps } from "./defaultProps";
import { renderTemplate } from "~/services";

const TEMPLATE = "login";
const subject = `Anmelden bei ${defaultProps.productNameApostrophized}`;
const knowledgeBaseUrl =
  "https://grundsteuererklaerung-fuer-privateigentum.zammad.com/help/de-de/34-anmeldung/22-der-link-funktioniert-nicht-was-soll-ich-tun";

const props = {
  subject,
  login: {
    plainText: `Auf folgenden Link klicken und bei ${defaultProps.productNameApostrophized} anmelden:`,
    htmlText: `Hier klicken und bei ${defaultProps.productNameApostrophized} anmelden`,
  },
  expiry: "Der Link läuft in 24 Stunden ab.",
  sameDevice:
    "Öffnen Sie den Link mit demselben Browser und Gerät, mit dem Sie ihn bestellt haben.",
  ignore:
    "Wenn Sie den Link nicht angefordert haben, können Sie diese E-Mail ignorieren.",
  knowledgeBase: {
    plainText: `Bei Problemen mit der Anmeldung, finden Sie weitere Informationen im Hilfebereich:\n${knowledgeBaseUrl}`,
    htmlText: `Bei Problemen mit der Anmeldung, finden Sie weitere Informationen im <a href="${knowledgeBaseUrl}">Hilfebereich</a>.`,
  },
};

export const createLoginMail = ({ magicLink }: { magicLink: string }) => {
  return {
    subject,
    textContent: renderTemplate({
      template: `${TEMPLATE}.plain`,
      props: { ...defaultProps, ...props, magicLink },
    }),
    htmlContent: renderTemplate({
      template: `${TEMPLATE}.html`,
      props: { ...defaultProps, ...props, magicLink },
    }),
  };
};
