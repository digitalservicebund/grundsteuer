import {
  ActionFunction,
  Form,
  LoaderFunction,
  redirect,
  useActionData,
  useLoaderData,
} from "remix";
import invariant from "tiny-invariant";
import { Button, Input } from "~/components";
import { validateEmail } from "~/domain/validation";
import { createUser, userExists } from "~/domain/user";

export const loader: LoaderFunction = () => {
  return {
    fromLoader: true,
  };
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const email = formData.get("email");
  const password = formData.get("password");
  invariant(
    typeof email === "string",
    "expected formData to include email field of type string"
  );
  invariant(
    typeof password === "string",
    "expected formData to include password field of type string"
  );

  const errors = {
    // valid email
    email:
      validateEmail(email, {
        msg: "E-Mail hat kein gültiges Format.",
      }) ||
      ((await userExists(email)) && "E-Mail existiert schon."),
    emailRepeated: false,
    password: false,
    passwordRepeated: false,
  };
  // valid password
  // repeated-password matchs
  // repeated-email matches
  // email does not exist

  const errorsExist =
    errors.email ||
    errors.emailRepeated ||
    errors.password ||
    errors.passwordRepeated;

  console.log({ errorsExist });

  if (!errorsExist) {
    await createUser(email, password);

    return redirect("/registrieren/erfolgreich");
  }

  return {
    fromAction: true,
    formData,
    errors,
  };
};

export default function Registrieren() {
  const loaderData = useLoaderData();
  const actionData = useActionData();
  return (
    <div>
      Registrieren
      {JSON.stringify({ loaderData })}
      {JSON.stringify({ actionData })}
      <Form method="post">
        <label htmlFor="email">E-Mail-Adresse</label>
        <Input type="email" name="email" />
        <label htmlFor="password">Passwort</label>
        <Input type="password" name="password" />
        <label htmlFor="email-repeated">E-Mail-Adresse wiederholen</label>
        <Input type="email" name="email-repeated" />
        <label htmlFor="password-repeated">Passwort wiederholen</label>
        <Input type="password" name="password-repeated" />
        <Button>Konto anlegen</Button>
      </Form>
    </div>
  );
}
