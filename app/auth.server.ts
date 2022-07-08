import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import { EmailLinkStrategy } from "remix-auth-email-link";
import invariant from "tiny-invariant";
import { sessionStorage } from "./session.server";
import { sendMagicLinkEmail } from "~/email.server";
import { findUserByEmail } from "~/domain/user";

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

authenticator.use(
  process.env.SKIP_AUTH === "true"
    ? new FormStrategy(async ({ form }) => login(form.get("email") as string))
    : new EmailLinkStrategy(
        {
          sendEmail: sendMagicLinkEmail,
          secret: magicLinkSecret,
          linkExpirationTime: 86400000, // 24 hours
          callbackURL: "/anmelden/bestaetigen",
          validateSessionMagicLink: true,
        },
        async ({ email }: { email: string }) => login(email)
      )
);
