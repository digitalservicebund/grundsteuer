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
import { Step1Data, TaxForm } from "~/domain/tax-form";

export const loader: LoaderFunction = async ({ request }): Promise<TaxForm> => {
  return getFormDataCookie(request);
};

export const action: ActionFunction = async ({ request }) => {
  const formData: FormData = await request.formData();
  const propertyStreet: string =
    (formData.get("property_street") as string | null) || "";
  const propertyStreetNumber: string =
    (formData.get("property_street_number") as string | null) || "";

  const cookie: TaxForm = await getFormDataCookie(request);
  cookie.step1Data = {
    propertyStreet,
    propertyStreetNumber,
  };

  const responseHeader: Headers = await createResponseHeaders(cookie);
  return redirect("/steps/summary", {
    headers: responseHeader,
  });
};

export default function Step1() {
  const formData: Step1Data = useLoaderData().step1Data;
  return (
    <div className="bg-beige-100 h-full p-4">
      <h1 className="mb-4 font-bold">Lage des Grundstücks</h1>

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
