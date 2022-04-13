import {
  Form,
  LoaderFunction,
  MetaFunction,
  useActionData,
  useLoaderData,
} from "remix";
import { getStoredFormData } from "~/formDataStorage.server";
import { GrundModel, StepDefinition } from "~/domain/steps";
import { pageTitle } from "~/util/pageTitle";
import { i18Next } from "~/i18n.server";
import {
  filterDataForReachablePaths,
  getStepData,
  StepFormData,
} from "~/domain/model";
import { zusammenfassung } from "~/domain/steps/zusammenfassung";
import { ActionData, I18nObject } from "~/routes/formular/_step";
import { Button, StepFormField } from "~/components";
import Accordion, { AccordionItem } from "~/components/Accordion";
import { authenticator } from "~/auth.server";
import { getFieldProps } from "~/util/getFieldProps";
export { action } from "~/routes/formular/_step";

type LoaderData = {
  formData: StepFormData;
  allData: GrundModel;
  i18n: I18nObject;
  stepDefinition: StepDefinition;
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/anmelden",
  });
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

const resolveCheckbox = (value: string | undefined) => {
  if (value) {
    return "Ja";
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

const resolveGrundstueckTyp = (value: string | undefined) => {
  switch (value) {
    case "einfamilienhaus":
      return "Einfamilienhaus";
    case "zweifamilienhaus":
      return "Zweifamilienhaus";
    case "wohnungseigentum":
      return "Wohnungseigentum";
    case "baureif":
      return "Baureif";
    case "abweichendeEntwicklung":
      return "Abweichende Entwicklung";
    default:
      return "";
  }
};

const resolveBundesland = (value: string | undefined) => {
  switch (value) {
    case "BE":
      return "Berlin";
    case "BB":
      return "Brandenburg";
    case "HB":
      return "Bremen";
    case "MV":
      return "Mecklenburg-Vorpommern";
    case "NW":
      return "Nordrhein-Westfalen";
    case "RP":
      return "Rheinland-Pfalz";
    case "SL":
      return "Saarland";
    case "SN":
      return "Sachsen";
    case "ST":
      return "Sachsen-Anhalt";
    case "SH":
      return "Schleswig-Holstein";
    case "TH":
      return "Thüringen";
    default:
      return "";
  }
};

export const meta: MetaFunction = () => {
  return { title: pageTitle("Zusammenfassung Ihrer Eingaben") };
};

export default function Zusammenfassung() {
  const { formData, allData, i18n, stepDefinition } =
    useLoaderData<LoaderData>();
  const actionData = useActionData() as ActionData;

  const item = (
    label: string,
    path: string | undefined,
    resolver?: (field: string | undefined) => string,
    explicitValue?: string
  ): JSX.Element => {
    let value;
    if (path) value = getStepData(allData, path);
    if (explicitValue) value = explicitValue;

    const displayValue = resolver ? resolver(value) : value;
    if (displayValue) {
      return (
        <li>
          <dl className="mb-16">
            <dt className="font-bold text-gray-800 block">{label}</dt>
            <dd className="font-bold block">{displayValue}</dd>
          </dl>
        </li>
      );
    } else {
      return <></>;
    }
  };

  const grundstueckAccordionItem = allData.grundstueck
    ? {
        header: <h2 className="font-bold text-2xl mb-3">Grundstück</h2>,
        content: (
          <div id="grundstueck-area">
            <ul>
              {item(
                "Grundstücksart",
                "grundstueck.typ.typ",
                resolveGrundstueckTyp
              )}
              {item("Straße", "grundstueck.adresse.strasse")}
              {item("Hausnummer", "grundstueck.adresse.hausnummer")}
              {item("Zusatzangaben", "grundstueck.adresse.zusatzangaben")}
              {item("PLZ", "grundstueck.adresse.plz")}
              {item("Ort", "grundstueck.adresse.ort")}
              {item(
                "Bundesland",
                "grundstueck.adresse.bundesland",
                resolveBundesland
              )}
              {item(
                "Steuernummer/Aktenzeichen",
                "grundstueck.steuernummer.steuernummer"
              )}
              {item(
                "Abweichende Entwicklung",
                "grundstueck.abweichendeEntwicklung.zustand"
              )}
              {item(
                "Innerhalb einer Gemeinde",
                "grundstueck.gemeinde.innerhalbEinerGemeinde",
                resolveJaNein
              )}
              {item("Anzahl Flurstücke", "grundstueck.anzahl.anzahl")}
              {allData.grundstueck.flurstueck && (
                <>
                  <h3 className="font-bold text-xl mb-1">Flurstücke</h3>
                  {allData.grundstueck.flurstueck.map((flurstueck, index) => {
                    const flurstueckKey = "flurstueck-" + index;
                    return (
                      <div
                        className="bg-gray-100 mb-3"
                        key={flurstueckKey}
                        id={flurstueckKey}
                      >
                        <h4 className="font-bold">Flurstück {index + 1}</h4>
                        <ul>
                          {item(
                            "Grundbuchblattnummer",
                            `grundstueck.flurstueck.${
                              index + 1
                            }.angaben.grundbuchblattnummer`
                          )}
                          {item(
                            "Gemarkung",
                            `grundstueck.flurstueck.${
                              index + 1
                            }.angaben.gemarkung`
                          )}
                          {item(
                            "Flur",
                            `grundstueck.flurstueck.${index + 1}.flur.flur`
                          )}
                          {item(
                            "Flurstück Zähler",
                            `grundstueck.flurstueck.${
                              index + 1
                            }.flur.flurstueckZaehler`
                          )}
                          {item(
                            "Flurstück Nenner",
                            `grundstueck.flurstueck.${
                              index + 1
                            }.flur.flurstueck`
                          )}
                          {item(
                            "Wirtsch. Einheit Zähler",
                            `grundstueck.flurstueck.${
                              index + 1
                            }.flur.wirtschaftlicheEinheitZaehler`
                          )}
                          {item(
                            "Wirtsch. Einheit Nenner",
                            `grundstueck.flurstueck.${
                              index + 1
                            }.flur.wirtschaftlicheEinheitNenner`
                          )}
                          {item(
                            "Größe ha",
                            `grundstueck.flurstueck.${index + 1}.flur.groesseHa`
                          )}
                          {item(
                            "Größe a",
                            `grundstueck.flurstueck.${index + 1}.flur.groesseA`
                          )}
                          {item(
                            "Größe m²",
                            `grundstueck.flurstueck.${index + 1}.flur.groesseQm`
                          )}
                        </ul>
                      </div>
                    );
                  })}
                </>
              )}
              {item(
                "Bodenrichtwert",
                "grundstueck.bodenrichtwert.bodenrichtwert"
              )}
              {item(
                "Zwei Bodenrichtwerte",
                "grundstueck.bodenrichtwert.twoBodenrichtwerte",
                resolveCheckbox
              )}
            </ul>
          </div>
        ),
      }
    : undefined;

  const gebaeudeAccordionItem = allData?.gebaeude
    ? {
        header: <h2 className="font-bold text-2xl mb-3">Gebäude</h2>,
        content: (
          <div id="gebaeude-area">
            <ul>
              {item(
                "Bezugsfertig ab 1949",
                "gebaeude.ab1949.isAb1949",
                resolveJaNein
              )}
              {item("Baujahr", "gebaeude.baujahr.baujahr")}
              {item(
                "Kernsaniert",
                "gebaeude.kernsaniert.isKernsaniert",
                resolveJaNein
              )}
              {item(
                "Jahr der Kernsanierung",
                "gebaeude.kernsanierungsjahr.kernsanierungsjahr"
              )}
              {item(
                "Abbruchverpflichtung liegt vor",
                "gebaeude.abbruchverpflichtung.hasAbbruchverpflichtung",
                resolveJaNein
              )}
              {item(
                "Jahr der Abbruchverpflichtung",
                "gebaeude.abbruchverpflichtungsjahr.abbruchverpflichtungsjahr"
              )}
              {item(
                "Wohnfläche",
                "gebaeude.wohnflaeche.wohnflaeche",
                resolveArea
              )}
              {item(
                "Wohnung 1 Wohnfläche",
                "gebaeude.wohnflaechen.wohnflaeche1",
                resolveArea
              )}
              {item(
                "Wohnung 2 Wohnfläche",
                "gebaeude.wohnflaechen.wohnflaeche2",
                resolveArea
              )}
              {item(
                "Weitere Wohnräume",
                "gebaeude.weitereWohnraeume.hasWeitereWohnraeume",
                resolveJaNein
              )}
              {item(
                "Anzahl der weiteren Wohnräume",
                "gebaeude.weitereWohnraeumeDetails.anzahl"
              )}
              {item(
                "Gesamtfläche der weiteren Wohnräume",
                "gebaeude.weitereWohnraeumeDetails.flaeche",
                resolveArea
              )}
              {allData.gebaeude?.garagen?.hasGaragen == "true"
                ? item("Anzahl Garagen", "gebaeude.garagenAnzahl.anzahlGaragen")
                : item(
                    "Anzahl Garagen",
                    "gebaeude.garagenAnzahl.anzahlGaragen",
                    undefined,
                    "0"
                  )}
            </ul>
          </div>
        ),
      }
    : undefined;

  const eigentuemerAccordionItem = allData?.eigentuemer
    ? {
        header: <h2 className="font-bold text-2xl mb-3">Eigentümer:innen</h2>,
        content: (
          <div id="eigentuemer-area">
            <ul>
              {item("Anzahl", "eigentuemer.anzahl.anzahl")}
              {item(
                "Verheiratet",
                "eigentuemer.verheiratet.areVerheiratet",
                resolveJaNein
              )}
            </ul>
            {allData.eigentuemer.person && (
              <>
                <h3 className="font-bold text-xl mb-1">Personen</h3>

                {allData.eigentuemer.person.map((person, index) => {
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
                          `eigentuemer.person.${
                            index + 1
                          }.persoenlicheAngaben.anrede`,
                          resolveAnrede
                        )}
                        {item(
                          "Titel",
                          `eigentuemer.person.${
                            index + 1
                          }.persoenlicheAngaben.titel`
                        )}
                        {item(
                          "Name",
                          `eigentuemer.person.${
                            index + 1
                          }.persoenlicheAngaben.name`
                        )}
                        {item(
                          "Vorname",
                          `eigentuemer.person.${
                            index + 1
                          }.persoenlicheAngaben.vorname`
                        )}
                        {item(
                          "Geburtsdatum",
                          `eigentuemer.person.${
                            index + 1
                          }.persoenlicheAngaben.geburtsdatum`
                        )}

                        {item(
                          "Straße",
                          `eigentuemer.person.${index + 1}.adresse.strasse`
                        )}
                        {item(
                          "Hausnummer",
                          `eigentuemer.person.${index + 1}.adresse.hausnummer`
                        )}
                        {item(
                          "Postfach",
                          `eigentuemer.person.${index + 1}.adresse.postfach`
                        )}
                        {item(
                          "PLZ",
                          `eigentuemer.person.${index + 1}.adresse.plz`
                        )}
                        {item(
                          "Ort",
                          `eigentuemer.person.${index + 1}.adresse.ort`
                        )}
                        {item(
                          "Telefonnummer",
                          `eigentuemer.person.${
                            index + 1
                          }.adresse.telefonnummer`
                        )}
                        {item(
                          "Steuer-ID",
                          `eigentuemer.person.${index + 1}.steuerId.steuerId`
                        )}
                        {item(
                          "Gesetzlicher Vertreter",
                          `eigentuemer.person.${index + 1}.hasVertreter`,
                          resolveJaNein
                        )}

                        {person.vertreter && (
                          <div
                            className="bg-gray-300 mx-4"
                            id={personKey + "-vertreter"}
                          >
                            <h5 className="font-bold">
                              Gesetzlicher Vertreter
                            </h5>
                            <ul>
                              {item(
                                "Anrede",
                                `eigentuemer.person.${
                                  index + 1
                                }.vertreter.name.anrede`,
                                resolveAnrede
                              )}
                              {item(
                                "Titel",
                                `eigentuemer.person.${
                                  index + 1
                                }.vertreter.name.titel`
                              )}
                              {item(
                                "Name",
                                `eigentuemer.person.${
                                  index + 1
                                }.vertreter.name.name`
                              )}
                              {item(
                                "Vorname",
                                `eigentuemer.person.${
                                  index + 1
                                }.vertreter.name.vorname`
                              )}

                              {item(
                                "Straße",
                                `eigentuemer.person.${
                                  index + 1
                                }.vertreter.adresse.strasse`
                              )}
                              {item(
                                "Hausnummer",
                                `eigentuemer.person.${
                                  index + 1
                                }.vertreter.adresse.hausnummer`
                              )}
                              {item(
                                "Postfach",
                                `eigentuemer.person.${
                                  index + 1
                                }.vertreter.adresse.postfach`
                              )}
                              {item(
                                "PLZ",
                                `eigentuemer.person.${
                                  index + 1
                                }.vertreter.adresse.plz`
                              )}
                              {item(
                                "Ort",
                                `eigentuemer.person.${
                                  index + 1
                                }.vertreter.adresse.ort`
                              )}
                              {item(
                                "Telefonnummer",
                                `eigentuemer.person.${
                                  index + 1
                                }.vertreter.adresse.telefonnummer`
                              )}
                            </ul>
                          </div>
                        )}
                        {person.anteil && (
                          <>
                            {item(
                              "Anteil Zähler",
                              `eigentuemer.person.${index + 1}.anteil.zaehler`
                            )}
                            {item(
                              "Anteil Nenner",
                              `eigentuemer.person.${index + 1}.anteil.nenner`
                            )}
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
                "Bruchteilsgemeinschaft Angaben übernehmen",
                "eigentuemer.bruchteilsgemeinschaft.predefinedData",
                resolveJaNein
              )}
              {allData.eigentuemer.bruchteilsgemeinschaftangaben && (
                <div className="bg-gray-300 mx-4" id={"bruchteilsgemeinschaft"}>
                  <h5 className="font-bold">Bruchteilsgemeinschaft Angaben</h5>
                  <ul>
                    {item(
                      "Name",
                      "eigentuemer.bruchteilsgemeinschaftangaben.angaben.name"
                    )}
                    {item(
                      "Straße",
                      "eigentuemer.bruchteilsgemeinschaftangaben.angaben.strasse"
                    )}
                    {item(
                      "Hausnummer",
                      "eigentuemer.bruchteilsgemeinschaftangaben.angaben.hausnummer"
                    )}
                    {item(
                      "Postfach",
                      "eigentuemer.bruchteilsgemeinschaftangaben.angaben.postfach"
                    )}
                    {item(
                      "PLZ",
                      "eigentuemer.bruchteilsgemeinschaftangaben.angaben.plz"
                    )}
                    {item(
                      "Ort",
                      "eigentuemer.bruchteilsgemeinschaftangaben.angaben.ort"
                    )}
                  </ul>
                </div>
              )}
            </ul>
            <ul>
              {item(
                "Empfangsvollmacht",
                "eigentuemer.empfangsvollmacht.hasEmpfangsvollmacht",
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
                      "eigentuemer.empfangsbevollmaechtigter.name.anrede",
                      resolveAnrede
                    )}
                    {item(
                      "Titel",
                      "eigentuemer.empfangsbevollmaechtigter.name.titel"
                    )}
                    {item(
                      "Name",
                      "eigentuemer.empfangsbevollmaechtigter.name.name"
                    )}
                    {item(
                      "Vorname",
                      "eigentuemer.empfangsbevollmaechtigter.name.vorname"
                    )}

                    {item(
                      "Straße",
                      "eigentuemer.empfangsbevollmaechtigter.adresse.strasse"
                    )}
                    {item(
                      "Hausnummer",
                      "eigentuemer.empfangsbevollmaechtigter.adresse.hausnummer"
                    )}
                    {item(
                      "Postfach",
                      "eigentuemer.empfangsbevollmaechtigter.adresse.postfach"
                    )}
                    {item(
                      "PLZ",
                      "eigentuemer.empfangsbevollmaechtigter.adresse.plz"
                    )}
                    {item(
                      "Ort",
                      "eigentuemer.empfangsbevollmaechtigter.adresse.ort"
                    )}
                    {item(
                      "Telefonnummer",
                      "eigentuemer.empfangsbevollmaechtigter.adresse.telefonnummer"
                    )}
                  </ul>
                </div>
              )}
            </ul>
          </div>
        ),
      }
    : undefined;

  const accordionItems = [
    grundstueckAccordionItem,
    gebaeudeAccordionItem,
    eigentuemerAccordionItem,
  ].filter((i) => {
    return i !== undefined;
  }) as AccordionItem[];

  const fieldProps = getFieldProps(
    stepDefinition,
    formData,
    i18n,
    actionData?.errors
  );

  return (
    <div className="pt-32 max-w-screen-md mx-auto w-1/2">
      <h1 className="mb-8 font-bold text-4xl">Zusammenfassung</h1>
      <Accordion items={accordionItems} />
      <div className="mt-32">
        <Form method="post" className="mb-16">
          <StepFormField {...fieldProps[0]} />
          <StepFormField {...fieldProps[1]} />

          <h2 className="font-bold text-20 mb-8">
            {i18n.specifics.confirmationHeading}
          </h2>
          <p className="mb-32">{i18n.specifics.confirmationText}</p>
          <StepFormField {...fieldProps[2]} />
          <StepFormField {...fieldProps[3]} />
          <Button id="nextButton">{i18n.specifics.submitbutton}</Button>
        </Form>
      </div>
    </div>
  );
}
