import {
  Button,
  Input,
  Label,
} from "@digitalservice4germany/digital-service-library";
import {
  ActionFunction,
  Form,
  LoaderFunction,
  redirect,
  useActionData,
  useLoaderData,
} from "remix";
import { createResponseHeaders, getFormDataCookie } from "~/cookies";
import { Formular, Step1Data } from "~/domain/formular";
import { machine } from "~/steps.server";
import { interpret } from "xstate";

export const loader: LoaderFunction = async ({
  request,
}): Promise<Step1Data> => {
  const taxForm = await getFormDataCookie(request);
  return taxForm.step1Data || {};
};

export const action: ActionFunction = async ({ request }) => {
  const formData: FormData = await request.formData();
  const propertyStreet: string =
    (formData.get("property_street") as string | null) || "";
  const propertyStreetNumber: string =
    (formData.get("property_street_number") as string | null) || "";

  const cookie: Formular = await getFormDataCookie(request);
  cookie.step1Data = {
    propertyStreet,
    propertyStreetNumber,
  };

  // work in progress
  return new Promise((resolve, reject) => {
    const stepsService = interpret(machine)
      .onTransition((state) => {
        console.log("STATE: ", JSON.stringify(state.value));

        if (JSON.stringify(state.value) === '{"step1":"complete"}') {
          resolve(true);
        }
      })
      .onEvent((event) => {
        console.log("EVENT: ", event.type);

        if (event.type.match(/error.*step1/)) {
          reject(true);
        }
      })
      .start();
    stepsService.send("VALIDATE");
  })
    .then(async () => {
      // TODO: redirect depending on form data
      const responseHeader: Headers = await createResponseHeaders(cookie);
      return redirect("/steps/summary", {
        headers: responseHeader,
      });
    })
    .catch(() => {
      // rerender
      return { errors: "many" };
    });
  // TODO: revisit once validation is complete
  // const responseHeader: Headers = await createResponseHeaders(cookie);
  // return redirect("/steps/summary", {
  //   headers: responseHeader,
  // });
};

export default function Step1() {
  const formData: Step1Data = useLoaderData();
  const actionData = useActionData();
  return (
    <div className="bg-beige-100 h-full p-4">
      <h1 className="mb-4 font-bold">Lage des Grundstücks</h1>

      {actionData?.errors ? "ERRORS: " + actionData.errors : ""}

      <Form method="post">
        <Label htmlFor="property_street">Straße</Label>
        <Input
          name="property_street"
          id="property_street"
          defaultValue={formData?.propertyStreet}
          className="mb-4"
        />
        <Label htmlFor="property_street_number">Hausnummer</Label>
        <Input
          name="property_street_number"
          id="property_street_number"
          defaultValue={formData?.propertyStreetNumber}
          className="mb-4"
        />

        <Button>Weiter</Button>
      </Form>
    </div>
  );
}
