// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import sdk from "sib-api-v3-sdk";
import type { SendEmailFunction } from "remix-auth-email-link";
import type { SessionUser } from "~/auth.server";
import {
  EmailStatus,
  getEmailStatus,
  hashMessageId,
} from "~/routes/api/sendinblue";
import { Feature, redis } from "./redis/redis.server";
import * as crypto from "crypto";

const SENDINBLUE_API_CONSIDERED_SLOW_MS = 2000;

export const sendToSendinblue = async (options: {
  subject: string;
  htmlContent: string;
  textContent: string;
  to: string;
}) => {
  // send emails only on production system or when using a digitalservice email address
  if (
    process.env.APP_ENV === "production" ||
    options.to.match(/@digitalservice.bund.de/)
  ) {
    const sendinblueApiKey = process.env.SENDINBLUE_API_KEY;
    const client = sdk.ApiClient.instance;
    const apiKey = client.authentications["api-key"];
    apiKey.apiKey = sendinblueApiKey;
    const apiInstance = new sdk.TransactionalEmailsApi();
    const email = new sdk.SendSmtpEmail();

    email.subject = options.subject;
    email.htmlContent = [
      '<!DOCTYPE html><html lang="de"><head>',
      '<meta http-equiv="Content-Type" content="text/html charset=UTF-8" />',
      `<title>${options.subject}</title>`,
      '<meta name="viewport" content="width=device-width, initial-scale=1.0"/>',
      "</head><body>",
      options.htmlContent,
      "</body></html>",
    ].join("");
    email.textContent = options.textContent;
    email.sender = {
      name: "Grundsteuererklärung für Privateigentum",
      email: "no-reply@mail.grundsteuererklaerung-fuer-privateigentum.de",
    };
    email.to = [{ email: options.to }];
    email.replyTo = {
      email: "hilfe@grundsteuererklaerung-fuer-privateigentum.de",
    };
    // disable List-Unsubscribe header
    email.headers = { "X-List-Unsub": "disabled" };

    const hashedEmail = crypto
      .createHash("sha1")
      .update(options.to)
      .digest("hex");

    try {
      const startApiCall = new Date();
      const data = await apiInstance.sendTransacEmail(email);
      const endApiCall = new Date();
      const durationInMs = endApiCall.valueOf() - startApiCall.valueOf();
      const messageId = data.messageId;
      const hashedMessageId = hashMessageId(messageId);
      const apiCallWasSlow = durationInMs > SENDINBLUE_API_CONSIDERED_SLOW_MS;

      console.log(
        `[email]${
          apiCallWasSlow ? "[slow]" : ""
        } Sendinblue API call was successful and took ${durationInMs}ms. MessageId: ${messageId} - Hashed messageId: ${hashedMessageId} - Hashed email: ${hashedEmail}`
      );

      const redisResponse = await redis.set(
        Feature.MESSAGE_ID,
        hashedEmail,
        JSON.stringify({
          email: options.to,
          messageId: hashedMessageId,
        }),
        24 * 60 * 60
      );
      console.log(
        `[email][redis] ${hashedEmail} ${JSON.stringify(redisResponse)}`
      );
    } catch (error) {
      console.error(
        `[email][error] Hashed email: ${hashedEmail} - Error: ${error}`
      );
      throw error;
    }
  } else {
    console.log("[email][not production] Would have sent this email:", options);
  }
};

const textGreetings = ["Guten Tag!", ""];

const htmlGreetings = ["<p>Guten Tag!</p>"];

const textFooter = [
  "",
  "Der Link läuft in 24 Stunden ab. Öffnen Sie den Link mit demselben Browser und Gerät, mit dem Sie ihn bestellt haben. Wenn Sie den Link nicht angefordert haben, können Sie diese E-Mail ignorieren. Bei Problemen mit der Anmeldung, kopieren Sie die folgende URL in die Adresszeile Ihres Browsers: https://grundsteuererklaerung-fuer-privateigentum.zammad.com/help/de-de/1-registrierung-und-anmeldung/22-der-link-funktioniert-nicht-was-soll-ich-tun",
  "",
  "",
  "-- ", // must be exactly 2 dashes + 1 space!
  "Grundsteuererklärung für Privateigentum",
  "Support-Team | DigitalService",
  "Website: https://digitalservice.bund.de",
  "Twitter: https://twitter.com/DigitalServBund",
  "LinkedIn: https://www.linkedin.com/company/digitalservicebund",
  "DigitalService GmbH des Bundes",
  "Prinzessinenstraße 8-14, 10969 Berlin",
  "USt-IdNr.: DE327075535 | Geschäftsführung: Christina Lang & Philipp Möser",
  "Handelsregisternummer: HRB 212879 B | Registergericht: Berlin Charlottenburg",
];

const htmlFooter = [
  "<p>Der Link läuft in 24 Stunden ab. Öffnen Sie den Link mit demselben Browser und Gerät, mit dem Sie ihn bestellt haben. Wenn Sie den Link nicht angefordert haben, können Sie diese E-Mail ignorieren. Bei Problemen mit der Anmeldung, klicken Sie <a href='https://grundsteuererklaerung-fuer-privateigentum.zammad.com/help/de-de/1-registrierung-und-anmeldung/22-der-link-funktioniert-nicht-was-soll-ich-tun'>hier</a>.</p>",
  '<hr style="margin-top: 3rem"/>',
  "<p><strong>Grundsteuererklärung für Privateigentum</strong><br />",
  'Support-Team | <a href="https://digitalservice.bund.de">DigitalService</a><br />',
  '<a href="https://twitter.com/DigitalServBund">Twitter</a> | <a href="https://www.linkedin.com/company/digitalservicebund">LinkedIn</a><br />',
  "DigitalService GmbH des Bundes<br />",
  "Prinzessinenstraße 8-14, 10969 Berlin<br />",
  "USt-IdNr.: DE327075535 | Geschäftsführung: Christina Lang & Philipp Möser<br />",
  "Handelsregisternummer: HRB 212879 B | Registergericht: Berlin Charlottenburg</p>",
];

export const sendMagicLinkEmail: SendEmailFunction<SessionUser> = async (
  options
) => {
  const subject = "Anmelden bei „Grundsteuererklärung für Privateigentum“";

  const textContent = textGreetings
    .concat(["", options.magicLink, ""])
    .concat(textFooter)
    .join("\n");

  const htmlContent = htmlGreetings
    .concat([
      `<p><strong><a href="${options.magicLink}">Hier klicken und bei „Grundsteuererklärung für Privateigentum“ anmelden</a></strong></p>`,
    ])
    .concat(htmlFooter)
    .join("");

  await sendToSendinblue({
    to: options.emailAddress,
    subject,
    textContent,
    htmlContent,
  });
};

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
