import { LoaderFunction, useLoaderData } from "remix";
import { getFormDataCookie } from "~/cookies";
import { createGraph } from "~/domain";
import { GrundModel } from "~/domain/steps";
import { StateMachineContext } from "~/domain/states";

type LoaderData = {
  graph: StateMachineContext;
  data: GrundModel;
};

export const loader: LoaderFunction = async ({ request }) => {
  const cookie = await getFormDataCookie(request);

  const graph = createGraph({
    machineContext: cookie.records,
  });

  return { graph, data: cookie.records };
};

const resolveJaNein = (value: string | undefined) => {
  if (value === "true") {
    return "Ja";
  }
  if (value === "false") {
    return "Nein";
  }
  return "";
};

const resolveAnrede = (value: string | undefined) => {
  if (value === "no_anrede") {
    return "Keine";
  }
  if (value === "frau") {
    return "Frau";
  }
  if (value === "herr") {
    return "Herr";
  }
  return "";
};

const resolveArea = (value: string | undefined) => {
  if (value) {
    return `${value} m2`;
  }
  return "";
};

const item = (
  label: string,
  value: string | undefined,
  resolver?: (field: string | undefined) => string
): JSX.Element => {
  return (
    <li>
      {label}: {resolver ? resolver(value) : value}
    </li>
  );
};

export default function Zusammenfassung() {
  const { graph, data } = useLoaderData<LoaderData>();

  return (
    <div className="bg-beige-100 h-full p-4">
      <h1 className="mb-8 font-bold text-4xl">Zusammenfassung</h1>
      {data?.gebaeude && (
        <>
          <h2 className="font-bold text-2xl mb-3">Gebäude</h2>
          <ul>
            {item(
              "Bezugsfertig ab 1949",
              data.gebaeude.ab1949?.isAb1949,
              resolveJaNein
            )}

            {data.gebaeude.ab1949?.isAb1949 === "true" &&
              item("Baujahr", data.gebaeude.baujahr?.baujahr)}

            {item(
              "Kernsaniert",
              data.gebaeude.kernsaniert?.isKernsaniert,
              resolveJaNein
            )}

            {data.gebaeude.kernsaniert?.isKernsaniert === "true" &&
              item(
                "Jahr der Kernsanierung",
                data.gebaeude.kernsanierungsjahr?.kernsanierungsjahr
              )}

            {item(
              "Abbruchverpflichtung liegt vor",
              data.gebaeude.abbruchverpflichtung?.hasAbbruchverpflichtung,
              resolveJaNein
            )}

            {data.gebaeude.abbruchverpflichtung?.hasAbbruchverpflichtung ===
              "true" &&
              item(
                "Jahr der Abbruchverpflichtung",
                data.gebaeude.abbruchverpflichtungsjahr
                  ?.abbruchverpflichtungsjahr
              )}

            {["einfamilienhaus", "wohnungseigentum"].includes(
              data.grundstueck?.typ?.typ as string
            ) &&
              item(
                "Wohnfläche",
                data.gebaeude.wohnflaeche?.wohnflaeche,
                resolveArea
              )}

            {data.grundstueck?.typ?.typ === "zweifamilienhaus" &&
              item(
                "Wohnung 1 Wohnfläche",
                data.gebaeude.wohnflaechen?.wohnflaeche1,
                resolveArea
              )}
            {data.grundstueck?.typ?.typ === "zweifamilienhaus" &&
              item(
                "Wohnung 2 Wohnfläche",
                data.gebaeude.wohnflaechen?.wohnflaeche2,
                resolveArea
              )}

            {item(
              "Weitere Wohnräume",
              data.gebaeude.weitereWohnraeume?.hasWeitereWohnraeume,
              resolveJaNein
            )}

            {data.gebaeude.weitereWohnraeume?.hasWeitereWohnraeume === "true" &&
              item(
                "Anzahl der weiteren Wohnräume",
                data.gebaeude.weitereWohnraeumeFlaeche?.anzahl
              )}

            {data.gebaeude.weitereWohnraeume?.hasWeitereWohnraeume === "true" &&
              item(
                "Gesamtfläche der weiteren Wohnräume",
                data.gebaeude.weitereWohnraeumeFlaeche?.flaeche,
                resolveArea
              )}

            {data.gebaeude.garagen?.hasGaragen === "true"
              ? item(
                  "Anzahl Garagen",
                  data.gebaeude.garagenAnzahl?.anzahlGaragen
                )
              : item("Anzahl Garagen", "0")}
          </ul>
        </>
      )}
      {data?.eigentuemer && (
        <>
          <h2 className="font-bold text-2xl mb-3">Eigentümer:innen</h2>
          <ul>
            {item("Anzahl", data.eigentuemer.anzahl?.anzahl)}

            {data.eigentuemer.verheiratet?.areVerheiratet &&
              item(
                "Verheiratet",
                data.eigentuemer.verheiratet.areVerheiratet,
                resolveJaNein
              )}
          </ul>
          {data.eigentuemer.person && (
            <>
              <h3 className="font-bold text-xl mb-1">Personen</h3>

              {data.eigentuemer.person.map((person: any, index: number) => {
                const personKey = "person-" + index;
                return (
                  <div
                    className="bg-gray-100 mb-3"
                    key={personKey}
                    id={personKey}
                  >
                    <h4 className="font-bold">Person {index + 1}</h4>
                    <ul>
                      {item(
                        "Anrede",
                        person.persoenlicheAngaben?.anrede,
                        resolveAnrede
                      )}
                      {item("Titel", person.persoenlicheAngaben?.titel)}
                      {item("Name", person.persoenlicheAngaben?.name)}
                      {item("Vorname", person.persoenlicheAngaben?.vorname)}
                      {item(
                        "Geburtsdatum",
                        person.persoenlicheAngaben?.geburtsdatum
                      )}

                      {item("Straße", person.adresse?.strasse)}
                      {item("Hausnummer", person.adresse?.hausnummer)}
                      {item("Postfach", person.adresse?.postfach)}
                      {item("PLZ", person.adresse?.plz)}
                      {item("Ort", person.adresse?.ort)}
                      {item(
                        "Telefonnummer",
                        person.telefonnummer?.telefonnummer
                      )}
                      {item("Steuer-ID", person.steuerId?.steuerId)}
                      {item(
                        "Gesetzlicher Vertreter",
                        person.gesetzlicherVertreter?.hasVertreter,
                        resolveJaNein
                      )}

                      {person.vertreter && (
                        <div
                          className="bg-gray-300 mx-4"
                          id={personKey + "-vertreter"}
                        >
                          <h5 className="font-bold">Gesetzlicher Vertreter</h5>
                          <ul>
                            {item(
                              "Anrede",
                              person.vertreter.name?.anrede,
                              resolveAnrede
                            )}
                            {item("Titel", person.vertreter.name?.titel)}
                            {item("Name", person.vertreter.name?.name)}
                            {item("Vorname", person.vertreter.name?.vorname)}

                            {item("Straße", person.vertreter.adresse?.strasse)}
                            {item(
                              "Hausnummer",
                              person.vertreter.adresse?.hausnummer
                            )}
                            {item(
                              "Postfach",
                              person.vertreter.adresse?.postfach
                            )}
                            {item("PLZ", person.vertreter.adresse?.plz)}
                            {item("Ort", person.vertreter.adresse?.ort)}
                            {item(
                              "Telefonnummer",
                              person.vertreter.telefonnummer?.telefonnummer
                            )}
                          </ul>
                        </div>
                      )}
                      {person.anteil && (
                        <>
                          {item("Anteil Zähler", person.anteil.zaehler)}
                          {item("Anteil Nenner", person.anteil.nenner)}
                        </>
                      )}
                    </ul>
                  </div>
                );
              })}
            </>
          )}
          <ul>
            {item(
              "Empfangsvollmacht",
              data.eigentuemer.empfangsvollmacht?.hasEmpfangsvollmacht,
              resolveJaNein
            )}
            {data.eigentuemer.empfangsbevollmaechtigter && (
              <div
                className="bg-gray-300 mx-4"
                id={"empfangsbevollmaechtigter"}
              >
                <h5 className="font-bold">Empfangsbevollmächtigte Person</h5>
                <ul>
                  {item(
                    "Anrede",
                    data.eigentuemer.empfangsbevollmaechtigter.name?.anrede,
                    resolveAnrede
                  )}
                  {item(
                    "Titel",
                    data.eigentuemer.empfangsbevollmaechtigter.name?.titel
                  )}
                  {item(
                    "Name",
                    data.eigentuemer.empfangsbevollmaechtigter.name?.name
                  )}
                  {item(
                    "Vorname",
                    data.eigentuemer.empfangsbevollmaechtigter.name?.vorname
                  )}

                  {item(
                    "Straße",
                    data.eigentuemer.empfangsbevollmaechtigter.adresse?.strasse
                  )}
                  {item(
                    "Hausnummer",
                    data.eigentuemer.empfangsbevollmaechtigter.adresse
                      ?.hausnummer
                  )}
                  {item(
                    "Postfach",
                    data.eigentuemer.empfangsbevollmaechtigter.adresse?.postfach
                  )}
                  {item(
                    "PLZ",
                    data.eigentuemer.empfangsbevollmaechtigter.adresse?.plz
                  )}
                  {item(
                    "Ort",
                    data.eigentuemer.empfangsbevollmaechtigter.adresse?.ort
                  )}
                  {item(
                    "Telefonnummer",
                    data.eigentuemer.empfangsbevollmaechtigter.telefonnummer
                      ?.telefonnummer
                  )}
                </ul>
              </div>
            )}
          </ul>
        </>
      )}
      <pre className="max-w-screen-md overflow-hidden">
        {JSON.stringify({ graph }, null, 2)}
      </pre>
    </div>
  );
}
