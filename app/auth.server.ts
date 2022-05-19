import { Authenticator } from "remix-auth";
import { sessionStorage } from "./session.server";
import { FormStrategy } from "remix-auth-form";
import bcrypt from "bcryptjs";
import { findUserByEmail } from "~/domain/user";

export type SessionUser = {
  email: string;
  id: string;
  identified: boolean;
};

export const authenticator = new Authenticator<SessionUser>(sessionStorage);

const login = async (email: string, password: string): Promise<SessionUser> => {
  const user = await findUserByEmail(email);
  if (user && (await bcrypt.compare(password, user.password))) {
    return {
      email: user.email,
      id: user.id,
      identified: user.identified,
    };
  }

  throw new Error("unknown user!");
};

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const email = form.get("email");
    const password = form.get("password");
    // the type of this user must match the type you pass to the Authenticator
    // the strategy will automatically inherit the type if you instantiate
    // directly inside the `use` method
    return login("" + email, "" + password);
  }),
  // each strategy has a name and can be changed to use another one
  // same strategy multiple times, especially useful for the OAuth2 strategy.
  "user-pass"
);
