import { defaultProps } from "./defaultProps";
import { renderMailTemplate } from "~/services";
import { convert } from "html-to-text";
import { Mail } from "~/services/sendMail";

const TEMPLATE = "declarationSent";
const subject = "Grundsteuererklärung erfolgreich übermittelt";

export type CreateDeclarationSentMailArgs = {
  to: string;
  transferticket: string;
  pdf?: string;
};

export const createDeclarationSentMail = ({
  to,
  transferticket,
  pdf,
}: CreateDeclarationSentMailArgs) => {
  const htmlContent = renderMailTemplate({
    template: `${TEMPLATE}.html`,
    props: {
      ...defaultProps,
      subject,
      transferticket,
      pdfIsAttached: Boolean(pdf),
    },
  });

  const props: Mail = {
    to,
    subject,
    textContent: convert(htmlContent),
    htmlContent,
  };

  if (pdf) {
    props.attachments = [
      {
        name: "Grundsteuererklaerung.pdf",
        content: pdf,
      },
    ];
  }

  return props;
};
