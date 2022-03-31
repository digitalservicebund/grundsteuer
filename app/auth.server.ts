import { Authenticator } from "remix-auth";
import { sessionStorage } from "./session.server";
import { FormStrategy } from "remix-auth-form";
import { db } from "~/db/db.server";
import bcrypt from "bcryptjs";

type User = {
  email: string;
};

export const authenticator = new Authenticator<User>(sessionStorage);

const login = async (email: string, password: string) => {
  const user = await db.user.findUnique({
    where: { email: email },
  });
  if (user && bcrypt.compareSync(password, user.password)) {
    return {
      email: user.email,
    };
  }

  throw new Error("unknown user!");
};

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const email = form.get("email");
    const password = form.get("password");
    const user = await login("" + email, "" + password);
    // the type of this user must match the type you pass to the Authenticator
    // the strategy will automatically inherit the type if you instantiate
    // directly inside the `use` method
    return user;
  }),
  // each strategy has a name and can be changed to use another one
  // same strategy multiple times, especially useful for the OAuth2 strategy.
  "user-pass"
);
