import { Link } from "@remix-run/react";
import { LoaderFunction, useLoaderData } from "remix";
import { getFormDataCookie } from "~/cookies";
import { Formular } from "~/domain/formular";

export const loader: LoaderFunction = async ({ request }) => {
  return getFormDataCookie(request);
};

export default function Zusammenfassung() {
  const formData: Formular = useLoaderData();
  return (
    <div className="bg-beige-100 h-full p-4">
      <h1 className="mb-4 font-bold">Übersicht</h1>
      <div>Straße: {formData.step1Data?.propertyStreet}</div>
      <div className="mb-4">
        Hausnummer: {formData.step1Data?.propertyStreetNumber}
      </div>
      <Link to="/steps/step1" className="block">
        Zurück
      </Link>
    </div>
  );
}
