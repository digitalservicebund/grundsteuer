import { Link } from "@remix-run/react";
import { LoaderFunction, useLoaderData } from "remix";
import { getFormDataCookie } from "~/cookies";

export const loader: LoaderFunction = async ({ request }) => {
  return await getFormDataCookie(request);
};

export default function Step2() {
  const formData = useLoaderData();
  return (
    <div className="bg-beige-100 h-full p-4">
      <h1 className="mb-4 font-bold">Step 2</h1>
      Street: {formData.street}
      <Link to="/steps/step1" className="mt-4 block">
        Zurück
      </Link>
    </div>
  );
}
