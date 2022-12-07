import { createFscRequestCreatedMail } from "~/mails";
import { sendMail } from "~/services";

export type SendFscRequestCreatedMailArgs = {
  to: string;
  createdAt: Date;
};

export const sendFscRequestCreatedMail = async (
  args: SendFscRequestCreatedMailArgs
) => sendMail(createFscRequestCreatedMail(args));
