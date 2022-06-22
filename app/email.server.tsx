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
      email: "kontakt@grundsteuererklaerung-fuer-privateigentum.de",
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
  "Wenn Sie den Link nicht angefordert haben, können Sie diese E-Mail einfach ignorieren.",
  "",
  "Vielen Dank",
  "Ihr Team von „Grundsteuererklärung für Privateigentum“",
  "",
  "-- ", // must be exactly 2 dashes + 1 space!
  "DigitalService GmbH des Bundes",
  "Prinzessinenstraße 8-14",
  "10969 Berlin",
  "",
  "Vertreten durch die Geschäftsführung: Frau Christina Lang, Herr Philipp Moeser",
  "Alleingesellschafterin: Bundesrepublik Deutschland, vertreten durch das Bundeskanzleramt",
  "",
  "Handelsregister-Nummer: HRB 212879 B",
  "Registergericht: Berlin Charlottenburg",
  "",
  "Kontakt: kontakt@grundsteuererklaerung-fuer-privateigentum.de",
  "Impressum: https://www.grundsteuererklaerung-fuer-privateigentum.de/impressum",
  "Datenschutzerklärung: https://www.grundsteuererklaerung-fuer-privateigentum.de/datenschutz",
];

const htmlFooter = [
  "<p>Wenn Sie den Link nicht angefordert haben, können Sie diese E-Mail einfach ignorieren.</p>",
  "<p>Vielen Dank<br />",
  "Ihr Team von „Grundsteuererklärung für Privateigentum“</p>",
  '<hr style="margin-top: 3rem"/>',
  "<p>DigitalService GmbH des Bundes<br />",
  "Prinzessinenstraße 8-14<br />",
  "10969 Berlin</p>",
  "<p>Vertreten durch die Geschäftsführung: Frau Christina Lang, Herr Philipp Moeser<br />",
  "Alleingesellschafterin: Bundesrepublik Deutschland, vertreten durch das Bundeskanzleramt</p>",
  "<p>Handelsregister-Nummer: HRB 212879 B<br />",
  "Registergericht: Berlin Charlottenburg</p>",
  '<p>Kontakt: <a href="mailto:kontakt@grundsteuererklaerung-fuer-privateigentum.de">kontakt@grundsteuererklaerung-fuer-privateigentum.de</a></p>',
  '<p><a href="https://www.grundsteuererklaerung-fuer-privateigentum.de/impressum">Impressum</a> | ',
  '<a href="https://www.grundsteuererklaerung-fuer-privateigentum.de/datenschutz">Datenschutzerklärung</a></p>',
];

export const sendMagicLinkEmail: SendEmailFunction<SessionUser> = async (
  options
) => {
  const subject = "Anmelden bei „Grundsteuererklärung für Privateigentum“";

  const textContent = textGreetings
    .concat([
      "Mit dieser E-Mail-Adresse wurde eine Anmeldung bei „Grundsteuererklärung für Privateigentum“ angefordert. Wenn Sie das waren und sich nun anmelden möchten, nutzen Sie bitte diesen Link:",
      "",
      options.magicLink,
    ])
    .concat(textFooter)
    .join("\n");

  const htmlContent = htmlGreetings
    .concat([
      "<p>Mit dieser E-Mail-Adresse wurde eine Anmeldung bei „Grundsteuererklärung für Privateigentum“ angefordert. Wenn Sie das waren und sich nun anmelden möchten, klicken Sie bitte auf diesen Link:</p>",
      `<p><strong><a href="${options.magicLink}">Anmelden bei „Grundsteuererklärung für Privateigentum“</a></strong></p>`,
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
    "https://www.grundsteuererklaerung-fuer-privateigentum/registrieren";

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
