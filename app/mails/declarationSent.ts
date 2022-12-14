import { defaultProps } from "./defaultProps";
import { renderMailTemplate } from "~/services";
import { convert } from "html-to-text";

const TEMPLATE = "declarationSent";
const subject = "Grundsteuererklärung erfolgreich übermittelt";

export const createDeclarationSentMail = ({
  to,
  transferticket,
  pdf,
}: {
  to: string;
  transferticket: string;
  pdf?: string;
}) => {
  const htmlContent = renderMailTemplate({
    template: `${TEMPLATE}.html`,
    props: {
      ...defaultProps,
      subject,
      transferticket,
      pdfIsAttached: Boolean(pdf),
    },
  });
  const props: { [key: string]: any } = {
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
