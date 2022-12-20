import { createDeclarationSentMail } from "~/mails";
import { sendMail } from "~/services";

export type SendDeclarationSentMailArgs = {
  to: string;
  transferticket: string;
  pdf?: string;
};

export const sendDeclarationSentMail = async ({
  to,
  transferticket,
  pdf,
}: SendDeclarationSentMailArgs) => {
  return sendMail(createDeclarationSentMail({ to, transferticket, pdf }));
};
