import { Button } from "@digitalservice4germany/digital-service-library";
import { useLoaderData, Form, ActionFunction, LoaderFunction } from "remix";
import { formDataCookie, getFormDataCookie } from "~/cookies";

export const loader: LoaderFunction = async ({ request }) => {
  const formData = await getFormDataCookie(request);
  return [formData];
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const street = formData.get("street");

  const cookie = await getFormDataCookie(request);

  cookie["street"] = street;

  return new Response("...", {
    headers: {
      "Set-Cookie": await formDataCookie.serialize(cookie),
    },
  });
};

export default function Index() {
  const formData = useLoaderData(); // TODO do I have to map here?
  return (
    <div className="bg-beige-100 h-full p-4">
      <h1>Step 1</h1>

      <Form method="post">
        <label htmlFor="street">Straße</label>
        <input name="street" id="street" defaultValue={formData.street} />

        <Button label="Weiter" />
      </Form>
    </div>
  );
}
