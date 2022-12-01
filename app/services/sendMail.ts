import { sendMail as sendinblueSendMail } from "~/sendinblue";

type Mail = {
  to: string;
  subject: string;
  textContent: string;
  htmlContent: string;
};

export const sendMail = async (mail: Mail) => {
  return sendinblueSendMail(mail);
};
