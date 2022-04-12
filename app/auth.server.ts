import { Authenticator } from "remix-auth";
import { sessionStorage } from "./session.server";
import { FormStrategy } from "remix-auth-form";
import { db } from "~/db.server";
import bcrypt from "bcryptjs";

export type SessionUser = {
  email: string;
  id: string;
  identified: boolean;
  state: string;
  ericaRequestId?: string;
  fscAntragsId?: string;
};

export const authenticator = new Authenticator<SessionUser>(sessionStorage);

const login = async (email: string, password: string): Promise<SessionUser> => {
  const user = await db.user.findUnique({
    where: { email: email },
  });
  if (user && bcrypt.compareSync(password, user.password)) {
    return {
      email: user.email,
      id: user.id,
      identified: user.identified,
      state: user.state,
      ericaRequestId: user.ericaRequestId,
      fscAntragsId: user.fscAntragsId,
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
