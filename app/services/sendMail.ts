import { sendMail as sendinblueSendMail } from "~/sendinblue";

type Mail = {
  subject: string;
  textContent: string;
  htmlContent: string;
};

export const sendMail = async ({ mail, to }: { mail: Mail; to: string }) => {
  return sendinblueSendMail({ ...mail, to });
};
