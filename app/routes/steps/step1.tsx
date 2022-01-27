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
import { getFormDataCookie, createResponseHeaders } from "~/cookies";

export type Step1FormData = {
  propertyStreet: string;
  propertyStreetNumber: string;
};

export const loader: LoaderFunction = async ({
  request,
}): Promise<Step1FormData> => {
  return (await getFormDataCookie(request)) as Step1FormData;
};

export const action: ActionFunction = async ({ request }) => {
  const formData: FormData = await request.formData();
  const propertyStreet: string = "" + formData.get("property_street");
  const propertyStreetNumber: string =
    "" + formData.get("property_street_number");

  const cookie: Step1FormData = (await getFormDataCookie(
    request
  )) as Step1FormData;
  cookie.propertyStreet = propertyStreet;
  cookie.propertyStreetNumber = propertyStreetNumber;

  const responseHeader: Headers = await createResponseHeaders(cookie);
  return redirect("/steps/summary", {
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
          defaultValue={formData.propertyStreet}
          className="mb-4"
        />
        <Label htmlFor="property_street_number">Hausnummer</Label>
        <Input
          name="property_street_number"
          id="property_street_number"
          defaultValue={formData.propertyStreetNumber}
          className="mb-4"
        />

        <Button>Weiter</Button>
      </Form>
    </div>
  );
}
