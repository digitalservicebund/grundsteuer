import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import { EmailLinkStrategy, SendEmailFunction } from "remix-auth-email-link";
import invariant from "tiny-invariant";
import { sessionStorage } from "./session.server";
import { findUserByEmail } from "~/domain/user";
import { createLoginMail } from "./mails";
import { sendMail } from "./services/sendMail";
import { flow } from "lodash";

export type SessionUser = {
  email: string;
  id: string;
  identified: boolean;
  inDeclarationProcess: boolean;
};

export const authenticator = new Authenticator<SessionUser>(sessionStorage);

const magicLinkSecret = process.env.MAGIC_LINK_SECRET;
invariant(magicLinkSecret, "MAGIC_LINK_SECRET env variable not set.");

const login = async (email: string): Promise<SessionUser> => {
  const user = await findUserByEmail(email);
  if (user) {
    console.log(`Logging in user ${user.id}`);
    return {
      email: user.email,
      id: user.id,
      identified: user.identified,
      inDeclarationProcess: user.inDeclarationProcess,
    };
  }
  throw new Error("unknown user!");
};

const sendEmail: SendEmailFunction<SessionUser> = async ({
  magicLink,
  emailAddress,
  form,
}) => {
  // TODO: use "form" to distinguish login and register
  return flow([createLoginMail, sendMail])({ magicLink, to: emailAddress });
};

authenticator.use(
  process.env.SKIP_AUTH === "true"
    ? new FormStrategy(async ({ form }) => login(form.get("email") as string))
    : new EmailLinkStrategy(
        {
          sendEmail,
          secret: magicLinkSecret,
          linkExpirationTime: 86400000, // 24 hours
          callbackURL: "/anmelden/bestaetigen",
          validateSessionMagicLink: true,
        },
        async ({ email }: { email: string }) => login(email)
      )
);
