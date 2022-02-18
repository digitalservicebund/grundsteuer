import { LoaderFunction, useLoaderData } from "remix";
import { getFormDataCookie } from "~/cookies";
import { createGraph } from "~/domain";
import { defaults, PersonData } from "~/domain/model";
import { Handle } from "~/components/SidebarNavigation";

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
          {data.eigentuemer.person.map((person: PersonData, index: number) => {
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
                Gesetzlicher Vertreter:{" "}
                {person.gesetzlicherVertreter?.hasVertreter === "true"
                  ? "Ja"
                  : "Nein"}
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
