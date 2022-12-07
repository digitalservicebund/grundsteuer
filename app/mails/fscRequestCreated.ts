import { defaultProps } from "./defaultProps";
import { renderMailTemplate } from "~/services";
import { convert } from "html-to-text";

const TEMPLATE = "fscRequestCreated";
const subject = "Freischaltcode erfolgreich angefordert";

export const createFscRequestCreatedMail = ({
  to,
  createdAt,
}: {
  to: string;
  createdAt: Date;
}) => {
  const htmlContent = renderMailTemplate({
    template: `${TEMPLATE}.html`,
    props: { ...defaultProps, subject, createdAt },
  });
  return {
    to,
    subject,
    textContent: convert(htmlContent, {}),
    htmlContent,
  };
};
