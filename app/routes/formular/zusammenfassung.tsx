import { LoaderFunction, useLoaderData } from "remix";
import { getFormDataCookie } from "~/cookies";
import { createGraph } from "~/domain";
import { Handle } from "~/components/SidebarNavigation";

export const loader: LoaderFunction = async ({ request }) => {
  const cookie = await getFormDataCookie(request);

  const graph = createGraph({
    machineContext: cookie.records,
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
          <ul>
            <li>Anzahl: {data.eigentuemer.anzahl?.anzahl}</li>
            {data.eigentuemer.verheiratet?.areVerheiratet && (
              <li>
                Verheiratet:{" "}
                {data.eigentuemer.verheiratet.areVerheiratet === "true"
                  ? "Ja"
                  : "Nein"}
              </li>
            )}
          </ul>
          {data.eigentuemer.person && (
            <h3 className="font-bold text-xl mb-1">Personen</h3>
          )}
          {data.eigentuemer.person.map((person: any, index: number) => {
            const personKey = "person-" + index;
            return (
              <div className="bg-gray-100 mb-3" key={personKey} id={personKey}>
                <h4 className="font-bold">Person {index + 1}</h4>
                <ul>
                  <li>Anrede: {person.persoenlicheAngaben?.anrede}</li>
                  <li>Titel: {person.persoenlicheAngaben?.titel}</li>
                  <li>Name: {person.persoenlicheAngaben?.name}</li>
                  <li>Vorname: {person.persoenlicheAngaben?.vorname}</li>
                  <li>
                    Geburtsdatum: {person.persoenlicheAngaben?.geburtsdatum}
                  </li>
                  <li>Straße: {person.adresse?.strasse}</li>
                  <li>Hausnummer: {person.adresse?.hausnummer}</li>
                  <li>Ort: {person.adresse?.ort}</li>
                  <li>PLZ: {person.adresse?.plz}</li>
                  <li>Zusatzangaben: {person.adresse?.zusatzangaben} </li>
                  <li>Postfach: {person.adresse?.postfach}</li>
                  <li>Telefonnummer: {person.telefonnummer?.telefonnummer}</li>
                  <li>Steuer-ID: {person.steuerId?.steuerId}</li>
                  <li>
                    Gesetzlicher Vertreter:{" "}
                    {person.gesetzlicherVertreter?.hasVertreter === "true"
                      ? "Ja"
                      : "Nein"}{" "}
                  </li>
                  {person.vertreter && (
                    <div
                      className="bg-gray-300 mx-4"
                      id={personKey + "-vertreter"}
                    >
                      <h5 className="font-bold">Gesetzlicher Vertreter</h5>
                      <ul>
                        <li>Anrede: {person.vertreter.name?.anrede}</li>
                        <li>Titel: {person.vertreter.name?.titel}</li>
                        <li>Name: {person.vertreter.name?.name}</li>
                        <li>Vorname: {person.vertreter.name?.vorname}</li>
                        <li>Straße: {person.vertreter.adresse?.strasse}</li>
                        <li>
                          Hausnummer: {person.vertreter.adresse?.hausnummer}
                        </li>
                        <li>
                          Zusatzangaben:{" "}
                          {person.vertreter.adresse?.zusatzangaben}
                        </li>
                        <li>Postfach: {person.vertreter.adresse?.postfach}</li>
                        <li>PLZ: {person.vertreter.adresse?.plz}</li>
                        <li>Ort: {person.vertreter.adresse?.ort}</li>
                        <li>
                          Telefonnummer:{" "}
                          {person.vertreter.telefonnummer?.telefonnummer}
                        </li>
                      </ul>
                    </div>
                  )}
                  {person.anteil && (
                    <>
                      <li>Anteil Zähler: {person.anteil.zaehler}</li>
                      <li>Anteil Nenner: {person.anteil.nenner}</li>
                    </>
                  )}
                </ul>
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
