import { EmailStatus, getEmailStatus } from "~/routes/api/sendinblue";

export const getStatus = async (
  hashedMessageId: string
): Promise<EmailStatus | null> => {
  return getEmailStatus(hashedMessageId);
};

export type UiStatus =
  | "request"
  | "deferred"
  | "delivered"
  | "address_problem"
  | "spam_blocker"
  | "mailbox_full"
  | "generic_error"
  | "unknown";

export const getUiStatus = (event: string, reason?: string) => {
  if (["request", "deferred", "delivered"].includes(event)) {
    return event;
  }

  if (["hard_bounce", "blocked"].includes(event)) {
    return "address_problem";
  }

  if (event === "soft_bounce" && reason) {
    if (/(does not exist|MX of domain|recipient address)/i.test(reason)) {
      return "address_problem";
    }
    if (
      /(spam|untrusted|poor reputation|gr[ae]ylist|bad.+score)/i.test(reason)
    ) {
      return "spam_blocker";
    }
    if (/(quota|storage|mailbox is full)/i.test(reason)) {
      return "mailbox_full";
    }
    return "generic_error";
  }

  return "request";
};
