import {
  Form,
  LoaderFunction,
  MetaFunction,
  useActionData,
  useLoaderData,
} from "remix";
import { getStoredFormData } from "~/formDataStorage.server";
import { GrundModel } from "~/domain/steps";
import { pageTitle } from "~/util/pageTitle";
import { i18Next } from "~/i18n.server";
import { filterDataForReachablePaths, getStepData } from "~/domain/model";
import { zusammenfassung } from "~/domain/steps/zusammenfassung";
import { ActionData, I18nObject } from "~/routes/formular/_step";
import { Button, StepFormFields } from "~/components";
import { getSession } from "~/session.server";
export { action } from "~/routes/formular/_step";

type LoaderData = {
  formData: Record<string, any>;
  allData: GrundModel;
  i18n: I18nObject;
  stepDefinition: {
    fields: Record<string, any>;
  };
};

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const user = session.get("user");
  const storedFormData = await getStoredFormData({ request, user });
  const filteredData = filterDataForReachablePaths(storedFormData);

  const tFunction = await i18Next.getFixedT("de", "all");
  return {
    formData: getStepData(storedFormData, "zusammenfassung"),
    allData: filteredData,
    i18n: {
      ...(tFunction("zusammenfassung") as I18nObject),
      common: { ...(tFunction("common") as I18nObject) },
    },
    stepDefinition: zusammenfassung,
  };
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
  const displayValue = resolver ? resolver(value) : value;
  if (displayValue) {
    return (
      <li>
        {label}: {displayValue}
      </li>
    );
  } else {
    return <></>;
  }
};

export const meta: MetaFunction = () => {
  return { title: pageTitle("Zusammenfassung Ihrer Eingaben") };
};

export default function Zusammenfassung() {
  const { formData, allData, i18n, stepDefinition } =
    useLoaderData<LoaderData>();
  const actionData = useActionData() as ActionData;

  return (
    <div className="pt-32 max-w-screen-md mx-auto w-1/2">
      <h1 className="mb-8 font-bold text-4xl">Zusammenfassung</h1>
      {allData?.grundstueck && (
        <>
          <h2 className="font-bold text-2xl mb-3">Grundstück</h2>
          <ul>
            {item(
              "Bodenrichtwert",
              allData.grundstueck.bodenrichtwert?.bodenrichtwert
            )}
            {item(
              "Zwei Bodenrichtwerte",
              allData.grundstueck.bodenrichtwert?.twoBodenrichtwerte
                ? "true"
                : undefined,
              resolveJaNein
            )}
          </ul>
        </>
      )}
      {allData?.gebaeude && (
        <>
          <h2 className="font-bold text-2xl mb-3">Gebäude</h2>
          <ul>
            {item(
              "Bezugsfertig ab 1949",
              allData.gebaeude.ab1949?.isAb1949,
              resolveJaNein
            )}

            {allData.gebaeude.ab1949?.isAb1949 === "true" &&
              item("Baujahr", allData.gebaeude.baujahr?.baujahr)}

            {item(
              "Kernsaniert",
              allData.gebaeude.kernsaniert?.isKernsaniert,
              resolveJaNein
            )}

            {item(
              "Jahr der Kernsanierung",
              allData.gebaeude.kernsanierungsjahr?.kernsanierungsjahr
            )}

            {item(
              "Abbruchverpflichtung liegt vor",
              allData.gebaeude.abbruchverpflichtung?.hasAbbruchverpflichtung,
              resolveJaNein
            )}

            {item(
              "Jahr der Abbruchverpflichtung",
              allData.gebaeude.abbruchverpflichtungsjahr
                ?.abbruchverpflichtungsjahr
            )}

            {item(
              "Wohnfläche",
              allData.gebaeude.wohnflaeche?.wohnflaeche,
              resolveArea
            )}

            {item(
              "Wohnung 1 Wohnfläche",
              allData.gebaeude.wohnflaechen?.wohnflaeche1,
              resolveArea
            )}
            {item(
              "Wohnung 2 Wohnfläche",
              allData.gebaeude.wohnflaechen?.wohnflaeche2,
              resolveArea
            )}

            {item(
              "Weitere Wohnräume",
              allData.gebaeude.weitereWohnraeume?.hasWeitereWohnraeume,
              resolveJaNein
            )}

            {item(
              "Anzahl der weiteren Wohnräume",
              allData.gebaeude.weitereWohnraeumeDetails?.anzahl
            )}

            {item(
              "Gesamtfläche der weiteren Wohnräume",
              allData.gebaeude.weitereWohnraeumeDetails?.flaeche,
              resolveArea
            )}

            {allData.gebaeude.garagenAnzahl?.anzahlGaragen
              ? item(
                  "Anzahl Garagen",
                  allData.gebaeude.garagenAnzahl?.anzahlGaragen
                )
              : item("Anzahl Garagen", "0")}
          </ul>
        </>
      )}
      {allData?.eigentuemer && (
        <>
          <h2 className="font-bold text-2xl mb-3">Eigentümer:innen</h2>
          <ul>
            {item("Anzahl", allData.eigentuemer.anzahl?.anzahl)}

            {item(
              "Verheiratet",
              allData?.eigentuemer?.verheiratet?.areVerheiratet,
              resolveJaNein
            )}
          </ul>
          {allData.eigentuemer.person && (
            <>
              <h3 className="font-bold text-xl mb-1">Personen</h3>

              {allData.eigentuemer.person.map((person: any, index: number) => {
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
                      {item("Telefonnummer", person.adresse?.telefonnummer)}
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
                              person.vertreter.adresse?.telefonnummer
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
              allData.eigentuemer.empfangsvollmacht?.hasEmpfangsvollmacht,
              resolveJaNein
            )}
            {allData.eigentuemer.empfangsbevollmaechtigter && (
              <div
                className="bg-gray-300 mx-4"
                id={"empfangsbevollmaechtigter"}
              >
                <h5 className="font-bold">Empfangsbevollmächtigte Person</h5>
                <ul>
                  {item(
                    "Anrede",
                    allData.eigentuemer.empfangsbevollmaechtigter.name?.anrede,
                    resolveAnrede
                  )}
                  {item(
                    "Titel",
                    allData.eigentuemer.empfangsbevollmaechtigter.name?.titel
                  )}
                  {item(
                    "Name",
                    allData.eigentuemer.empfangsbevollmaechtigter.name?.name
                  )}
                  {item(
                    "Vorname",
                    allData.eigentuemer.empfangsbevollmaechtigter.name?.vorname
                  )}

                  {item(
                    "Straße",
                    allData.eigentuemer.empfangsbevollmaechtigter.adresse
                      ?.strasse
                  )}
                  {item(
                    "Hausnummer",
                    allData.eigentuemer.empfangsbevollmaechtigter.adresse
                      ?.hausnummer
                  )}
                  {item(
                    "Postfach",
                    allData.eigentuemer.empfangsbevollmaechtigter.adresse
                      ?.postfach
                  )}
                  {item(
                    "PLZ",
                    allData.eigentuemer.empfangsbevollmaechtigter.adresse?.plz
                  )}
                  {item(
                    "Ort",
                    allData.eigentuemer.empfangsbevollmaechtigter.adresse?.ort
                  )}
                  {item(
                    "Telefonnummer",
                    allData.eigentuemer.empfangsbevollmaechtigter.adresse
                      ?.telefonnummer
                  )}
                </ul>
              </div>
            )}
          </ul>
        </>
      )}
      <div className="mt-32">
        <Form method="post" className="mb-16">
          <StepFormFields
            {...{
              stepDefinition,
              formData,
              i18n,
              currentState: "zusammenfassung",
              errors: actionData?.errors,
            }}
          />
          <Button id="nextButton">Erklärung abschicken</Button>
        </Form>
      </div>
    </div>
  );
}
