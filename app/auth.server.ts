import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import { EmailLinkStrategy } from "remix-auth-email-link";
import { sessionStorage } from "./session.server";
import { sendMagicLinkEmail } from "~/email.server";
import { findUserByEmail } from "~/domain/user";
import env from "~/env";

export type SessionUser = {
  email: string;
  id: string;
  identified: boolean;
  inDeclarationProcess: boolean;
};

export const authenticator = new Authenticator<SessionUser>(sessionStorage);

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

authenticator.use(
  env.SKIP_AUTH
    ? new FormStrategy(async ({ form }) => login(form.get("email") as string))
    : new EmailLinkStrategy(
        {
          sendEmail: sendMagicLinkEmail,
          secret: env.MAGIC_LINK_SECRET,
          linkExpirationTime: 86400000, // 24 hours
          callbackURL: "/anmelden/bestaetigen",
          validateSessionMagicLink: true,
        },
        async ({ email }: { email: string }) => login(email)
      )
);
