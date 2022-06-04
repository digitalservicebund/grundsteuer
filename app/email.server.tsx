// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import sdk from "sib-api-v3-sdk";
import { renderToString } from "react-dom/server";
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
    email.htmlContent = options.htmlContent;
    email.textContent = options.textContent;
    email.sender = {
      name: "Grundsteuererklärung für Privateigentum",
      email: "kontakt@grundsteuererklaerung-fuer-privateigentum.de",
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
          "Sendinblue API called successfully. Returned data: " +
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

export const sendMagicLinkEmail: SendEmailFunction<SessionUser> = async (
  options
) => {
  const subject = "Anmelden bei Grundsteuererklärung für Privateigentum";

  const textContent = [
    "Hallo!",
    "Mit dieser E-Mail-Adresse wurde eine Anmeldung bei Grundsteuererklärung für Privateigentum angefordert. Wenn Sie das waren und sich nun anmelden möchten, klicken Sie bitte auf diesen Link:",
    options.magicLink,
    "Wenn Sie den Link nicht angefordert haben, können Sie diese E-Mail einfach ignorieren.",
    "Vielen Dank!",
  ].join("\n\n");

  const htmlContent = renderToString(
    <>
      <p>Hallo!</p>
      <p>
        Mit dieser E-Mail-Adresse wurde eine Anmeldung bei Grundsteuererklärung
        für Privateigentum angefordert. Wenn Sie das waren und sich nun anmelden
        möchten, klicken Sie bitte auf diesen Link:
      </p>
      <p>
        <a href={options.magicLink}>Anmelden</a>
        <p>
          Wenn Sie den Link nicht angefordert haben, können Sie diese E-Mail
          einfach ignorieren.
        </p>
        <p>Vielen Dank!</p>
      </p>
    </>
  );

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

  const textContent = [
    "Hallo!",
    "Mit dieser E-Mail-Adresse wurde eine Anmeldung bei Grundsteuererklärung für Privateigentum angefordert. Allerdings muss zuerst eine Registrierung durchgeführt werden. Bitte klicken Sie auf den Link, um sich zu registrieren:",
    "https://www.grundsteuererklaerung-fuer-privateigentum/registrieren",
    "Wenn Sie den Link nicht angefordert haben, können Sie diese E-Mail einfach ignorieren.",
    "Vielen Dank!",
  ].join("\n\n");

  const htmlContent = renderToString(
    <>
      <p>Hallo!</p>
      <p>
        Mit dieser E-Mail-Adresse wurde eine Anmeldung bei Grundsteuererklärung
        für Privateigentum angefordert. Allerdings muss zuerst eine
        Registrierung durchgeführt werden. Bitte klicken Sie auf den Link, um
        sich zu registrieren:
      </p>
      <p>
        <a href="https://www.grundsteuererklaerung-fuer-privateigentum.de/registrieren">
          Registrieren
        </a>
        <p>
          Wenn Sie den Link nicht angefordert haben, können Sie diese E-Mail
          einfach ignorieren.
        </p>
        <p>Vielen Dank!</p>
      </p>
    </>
  );

  sendToSendinblue({
    to: options.emailAddress,
    subject,
    textContent,
    htmlContent,
  });
};
