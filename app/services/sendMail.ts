import fetch from "cross-fetch";
import invariant from "tiny-invariant";

export type Mail = {
  to: string;
  subject: string;
  textContent: string;
  htmlContent: string;
  attachments?: {
    name: string;
    content: string; // base64 encoded
  }[];
};

const buildRequestBody = ({
  subject,
  to,
  textContent,
  htmlContent,
  attachments,
}: Mail) => {
  const body: { [key: string]: any } = {
    sender: {
      name: "Grundsteuererklärung für Privateigentum",
      email: "no-reply@mail.grundsteuererklaerung-fuer-privateigentum.de",
    },
    replyTo: { email: "hilfe@grundsteuererklaerung-fuer-privateigentum.de" },
    subject,
    to: [{ email: to }],
    textContent,
    htmlContent,
    headers: { "X-List-Unsub": "disabled" },
  };

  if (attachments) {
    body.attachment = attachments;
  }

  return JSON.stringify(body);
};

export const sendMail = async (mail: Mail) => {
  const response = await fetch("https://api.sendinblue.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "api-key": process.env.SENDINBLUE_API_KEY as string,
    },
    body: buildRequestBody(mail),
  });

  if (!response.ok) {
    throw new Error(
      `Sendinblue returned non-2xx response: ${response.status} ${response.statusText}`
    );
  }

  const { messageId } = await response.json();

  invariant(messageId, "Expected Sendinblue to return messageId.");

  return { to: mail.to, messageId };
};
