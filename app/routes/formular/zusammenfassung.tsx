import { LoaderFunction, useLoaderData } from "remix";
import { getFormDataCookie } from "~/cookies";
import { createGraph } from "~/domain";
import { Handle } from "~/components/SidebarNavigation";
import { defaults } from "~/domain/model";

export const loader: LoaderFunction = async ({ request }) => {
  const cookie = await getFormDataCookie(request);

  const graph = createGraph({
    machineContext: Object.keys(cookie).length < 1 ? defaults : cookie.records,
  });

  return { graph, data: cookie.records };
};

// this will activate showing the form navigation in root.tsx
export const handle: Handle = {
  showFormNavigation: true,
};

export default function Zusammenfassung() {
  const { graph, data } = useLoaderData();

  return (
    <div className="bg-beige-100 h-full p-4">
      <h1 className="mb-8 font-bold text-4xl">Zusammenfassung</h1>
      {data?.eigentuemer && (
        <>
          <h2 className="font-bold text-2xl mb-3">Eigentümer:innen</h2>
          Anzahl: {data.eigentuemer.anzahl?.anzahl} <br />
          {data.eigentuemer.verheiratet?.areVerheiratet && (
            <div className="mb-3">
              Verheiratet:{" "}
              {data.eigentuemer.verheiratet.areVerheiratet === "true"
                ? "Ja"
                : "Nein"}
            </div>
          )}
          {data.eigentuemer.person && (
            <h3 className="font-bold text-xl mb-1">Personen</h3>
          )}
          {data.eigentuemer.person.map((person: any, index: number) => {
            const personKey = "person-" + index;
            return (
              <div className="bg-gray-100 mb-3" key={personKey} id={personKey}>
                <h4 className="font-bold">Person {index + 1}</h4>
                Straße: {person.adresse.strasse} <br />
                Hausnummer: {person.adresse.hausnummer} <br />
                Ort: {person.adresse.ort} <br />
                PLZ: {person.adresse.plz} <br />
                Zusatzangaben: {person.adresse.zusatzangaben} <br />
                Postfach: {person.adresse.postfach} <br />
                Telefonnummer: {person.telefonnummer?.telefonnummer} <br />
                Steuer-ID: {person.steuerId?.steuerId} <br />
                Gesetzlicher Vertreter:{" "}
                {person.gesetzlicherVertreter?.hasVertreter === "true"
                  ? "Ja"
                  : "Nein"}{" "}
                <br />
                {person.vertreter && (
                  <div
                    className="bg-gray-300 mx-4"
                    id={personKey + "-vertreter"}
                  >
                    <h5 className="font-bold">Gesetzlicher Vertreter</h5>
                    Anrede: {person.vertreter.name?.anrede}
                    <br />
                    Titel: {person.vertreter.name?.titel}
                    <br />
                    Name: {person.vertreter.name?.name}
                    <br />
                    Vorname: {person.vertreter.name?.vorname}
                    <br />
                    Straße: {person.vertreter.adresse?.strasse}
                    <br />
                    Hausnummer: {person.vertreter.adresse?.hausnummer}
                    <br />
                    Zusatzangaben: {person.vertreter.adresse?.zusatzangaben}
                    <br />
                    Postfach: {person.vertreter.adresse?.postfach}
                    <br />
                    PLZ: {person.vertreter.adresse?.plz}
                    <br />
                    Ort: {person.vertreter.adresse?.ort}
                    <br />
                    Telefonnummer:{" "}
                    {person.vertreter.telefonnummer?.telefonnummer}
                    <br />
                  </div>
                )}
                {person.anteil && (
                  <>
                    Anteil Zähler: {person.anteil.zaehler}
                    <br />
                    Anteil Nenner: {person.anteil.nenner}
                    <br />
                  </>
                )}
              </div>
            );
          })}
        </>
      )}
      <pre className="max-w-screen-md overflow-hidden">
        {JSON.stringify({ graph }, null, 2)}
      </pre>
    </div>
  );
}
