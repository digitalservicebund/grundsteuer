import { useEffect } from "react";
import {
  ActionFunction,
  Form,
  LoaderFunction,
  useActionData,
  useLoaderData,
} from "remix";
import { authenticator } from "~/auth.server";
import { Button, FormGroup, Input, SimplePageLayout } from "~/components";

export const loader: LoaderFunction = async ({ request }) => {
  // logic
  return { loader: true };
};

export const action: ActionFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/anmelden",
  });
  console.log({ user }, user.state, user.ericaRequestId);
  // check: state of user
  // redirect if all done

  // erica request in progress

  const formData = await request.formData();
  const steuerId = formData.get("steuerId");
  const geburtsdatum = formData.get("geburtsdatum");
  // validate steuerId && geburtstag -> return { errors }

  // erica request request

  return {
    errors: { geburtsdatum: "fehlt" },
    action: true,
    geburtsdatum,
    steuerId,
  };
};

export default function FscBeantragen() {
  const loaderData = useLoaderData();
  const actionData = useActionData();

  useEffect(() => {
    document.title = "Hallo";
  }, []);

  return (
    <SimplePageLayout>
      <pre>{JSON.stringify(loaderData, null, 2)}</pre>
      <pre>{JSON.stringify(actionData, null, 2)}</pre>
      <br />
      <Form method="post">
        <FormGroup>
          <Input name="steuerId" label="Steuer-ID" help="kein plan" />
        </FormGroup>
        <FormGroup>
          <Input
            name="geburtsdatum"
            label="Geburtstagsdatum"
            error={actionData?.errors?.geburtsdatum}
          />
        </FormGroup>
        <Button>Senden</Button>
      </Form>
    </SimplePageLayout>
  );
}
