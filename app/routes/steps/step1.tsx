import { Button, Input } from "@digitalservice4germany/digital-service-library";
import {
  useLoaderData,
  Form,
  ActionFunction,
  LoaderFunction,
  redirect,
} from "remix";
import { getFormDataCookie, getFormDataCookieResponseHeader } from "~/cookies";

export const loader: LoaderFunction = async ({ request }) => {
  return await getFormDataCookie(request);
};

export const action: ActionFunction = async ({ request }) => {
  const formData: FormData = await request.formData();
  const street: string = "" + formData.get("street");

  const cookie: Record<string, string> = await getFormDataCookie(request);
  cookie["street"] = street;

  const responseHeader: Record<string, string> =
    await getFormDataCookieResponseHeader(cookie);
  return redirect("/steps/step2", {
    headers: responseHeader,
  });
};

export default function Step1() {
  const formData = useLoaderData();
  return (
    <div className="bg-beige-100 h-full p-4">
      <h1 className="mb-4 font-bold">Step 1</h1>

      <Form method="post">
        <label htmlFor="street">Straße</label>
        <Input
          name="street"
          id="street"
          defaultValue={formData.street}
          className="mb-4"
        />

        <Button>Weiter</Button>
      </Form>
    </div>
  );
}
