// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import sdk from "sib-api-v3-sdk";
import type { SendEmailFunction } from "remix-auth-email-link";
import type { SessionUser } from "~/auth.server";

export const sendToSendinblue = (options: {
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

    apiInstance.sendTransacEmail(email).then(
      function (data: any) {
        console.log(
          "Sendinblue API called successfully. Message ID: " +
            JSON.stringify(data)
        );
      },
      function (error: any) {
        console.error(error);
      }
    );
  } else {
    console.log("Email sent! (not really, actually)", options);
  }
};

const textGreetings = ["Guten Tag!", ""];

const htmlGreetings = ["<p>Guten Tag!</p>"];

const textFooter = [
  "",
  "Der Link läuft in 24 Stunden ab. Öffnen Sie den Link mit demselben Browser und Gerät, mit dem Sie ihn bestellt haben. Wenn Sie den Link nicht angefordert haben, können Sie diese E-Mail ignorieren. Sie haben Probleme sich anzumelden? Hilfe finden Sie unter https://grundsteuererklaerung-fuer-privateigentum.zammad.com/help/de-de/1-registrierung-und-anmeldung/22-der-link-funktioniert-nicht-was-soll-ich-tun",
  "",
  "",
  "-- ", // must be exactly 2 dashes + 1 space!
  "Grundsteuererklärung für Privateigentum",
  "Support-Team | DigitalService",
  "Website: https://digitalservice.bund.de",
  "Twitter: https://twitter.com/DigitalServ4Ger",
  "LinkedIn: https://www.linkedin.com/company/digitalservicebund",
  "DigitalService GmbH des Bundes",
  "Prinzessinenstraße 8-14, 10969 Berlin",
  "USt-IdNr.: DE327075535 | Geschäftsführung: Christina Lang & Philipp Möser",
  "Handelsregisternummer: HRB 212879 B | Registergericht: Berlin Charlottenburg",
];

const htmlFooter = [
  "<p>Der Link läuft in 24 Stunden ab. Öffnen Sie den Link mit demselben Browser und Gerät, mit dem Sie ihn bestellt haben. Wenn Sie den Link nicht angefordert haben, können Sie diese E-Mail ignorieren. Sie haben <a href='https://grundsteuererklaerung-fuer-privateigentum.zammad.com/help/de-de/1-registrierung-und-anmeldung/22-der-link-funktioniert-nicht-was-soll-ich-tun'>Probleme</a> sich anzumelden?</p>",
  '<hr style="margin-top: 3rem"/>',
  "<p><strong>Grundsteuererklärung für Privateigentum</strong><br />",
  'Support-Team | <a href="https://digitalservice.bund.de">DigitalService</a><br />',
  '<a href="https://twitter.com/DigitalServ4Ger">Twitter</a> | <a href="https://www.linkedin.com/company/digitalservicebund">LinkedIn</a><br />',
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

  sendToSendinblue({
    to: options.emailAddress,
    subject,
    textContent,
    htmlContent,
  });
};

export const sendLoginAttemptEmail = async (options: {
  emailAddress: string;
}) => {
  const subject =
    "Versuchte Anmeldung bei Grundsteuererklärung für Privateigentum";

  const registerUrl =
    "https://www.grundsteuererklaerung-fuer-privateigentum.de/pruefen/start";

  const textContent = textGreetings
    .concat([
      "Mit dieser E-Mail-Adresse wurde eine Anmeldung bei Grundsteuererklärung für Privateigentum angefordert. Bitte registrieren Sie sich zunächst. Nutzen Sie dazu den folgenden Link:",
      "",
      registerUrl,
    ])
    .concat(textFooter)
    .join("\n");

  const htmlContent = htmlGreetings
    .concat([
      "<p>Mit dieser E-Mail-Adresse wurde eine Anmeldung bei Grundsteuererklärung für Privateigentum angefordert. Bitte registrieren Sie sich zunächst. Klicken Sie dazu auf den folgenden Link:</p>",
      `<p><strong><a href="${registerUrl}">Registrieren bei „Grundsteuererklärung für Privateigentum“</a></strong></p>`,
    ])
    .concat(htmlFooter)
    .join("");

  sendToSendinblue({
    to: options.emailAddress,
    subject,
    textContent,
    htmlContent,
  });
};
