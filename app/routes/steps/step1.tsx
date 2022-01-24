import {
  Button,
  Input,
  Label,
} from "@digitalservice4germany/digital-service-library";
import {
  useLoaderData,
  Form,
  ActionFunction,
  LoaderFunction,
  redirect,
} from "remix";
import { getFormDataCookie, getFormDataCookieResponseHeader } from "~/cookies";

type Step1FormData = {
  property_street: string;
  property_street_number: string;
};

export const loader: LoaderFunction = async ({
  request,
}): Promise<Step1FormData> => {
  return (await getFormDataCookie(request)) as Step1FormData;
};

export const action: ActionFunction = async ({ request }) => {
  const formData: FormData = await request.formData();
  const property_street: string = "" + formData.get("property_street");
  const property_street_number: string =
    "" + formData.get("property_street_number");

  const cookie: Step1FormData = (await getFormDataCookie(
    request
  )) as Step1FormData;
  cookie.property_street = property_street;
  cookie.property_street_number = property_street_number;

  const responseHeader: Record<string, string> =
    await getFormDataCookieResponseHeader(cookie);
  return redirect("/steps/step2", {
    headers: responseHeader,
  });
};

export default function Step1() {
  const formData: Step1FormData = useLoaderData();
  return (
    <div className="bg-beige-100 h-full p-4">
      <h1 className="mb-4 font-bold">Lage des Grundstücks</h1>

      <Form method="post">
        <Label htmlFor="property_street">Straße</Label>
        <Input
          name="property_street"
          id="property_street"
          defaultValue={formData.property_street}
          className="mb-4"
        />
        <Label htmlFor="property_street_number">Hausnummer</Label>
        <Input
          name="property_street_number"
          id="property_street_number"
          defaultValue={formData.property_street_number}
          className="mb-4"
        />

        <Button>Weiter</Button>
      </Form>
    </div>
  );
}
