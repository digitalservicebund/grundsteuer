import { defaultProps } from "./defaultProps";
import { renderMailTemplate } from "~/services";
import { convert } from "html-to-text";

const TEMPLATE = "login";
const subject = `Anmelden bei ${defaultProps.productNameApostrophized}`;
const knowledgeBaseUrl =
  "https://grundsteuererklaerung-fuer-privateigentum.zammad.com/help/de-de/34-anmeldung/22-der-link-funktioniert-nicht-was-soll-ich-tun";

export const createLoginMail = ({
  magicLink,
  to,
}: {
  magicLink: string;
  to: string;
}) => {
  const htmlContent = renderMailTemplate({
    template: `${TEMPLATE}.html`,
    props: { ...defaultProps, subject, magicLink, knowledgeBaseUrl },
  });

  return {
    to,
    subject,
    textContent: convert(htmlContent),
    htmlContent,
  };
};
