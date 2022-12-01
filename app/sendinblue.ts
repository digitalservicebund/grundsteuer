// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import sdk from "sib-api-v3-sdk";
import { hashMessageId } from "~/routes/api/sendinblue";
import { Feature, redis } from "./redis/redis.server";
import * as crypto from "crypto";

const SENDINBLUE_API_CONSIDERED_SLOW_MS = 2000;

export const sendMail = async (options: {
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
