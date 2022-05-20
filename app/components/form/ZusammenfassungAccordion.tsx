import { getStepData } from "~/domain/model";
import Unfinished from "~/components/icons/mui/Unfinished";
import Finished from "~/components/icons/mui/Finished";
import Edit from "~/components/icons/mui/Edit";
import { conditions } from "~/domain/guards";
import Accordion, { AccordionItem } from "~/components/Accordion";
import {
  GrundModel,
  GrundstueckAdresseFields,
  GrundstueckFlurstueckFlurFields,
  GrundstueckFlurstueckGroesseFields,
} from "~/domain/steps";
import { I18nObject } from "~/i18n/getStepI18n";
import { PreviousStepsErrors } from "~/routes/formular/zusammenfassung";
import House from "~/components/icons/mui/House";
import { ReactNode } from "react";
import Person from "~/components/icons/mui/Person";
import classNames from "classnames";
import _ from "lodash";
import invariant from "tiny-invariant";
import { GrundstueckFlurstueckMiteigentumsanteilFields } from "~/domain/steps/grundstueck/flurstueck/miteigentumsanteil";
import { calculateGroesse } from "~/erica/transformData";

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

const resolveAbweichendeEntwicklung = (value: string | undefined) => {
  switch (value) {
    case "rohbauland":
      return "Rohbauland";
    case "bauerwartungsland":
      return "Bauerwartungsland";
    default:
      return "";
  }
};

const resolveMiteigentum: FieldResolver = (value) => {
  switch (value) {
    case "true":
      return "Teil der Grundstückseinheit";
    case "false":
      return "Gesamte Grundstückseinheit";
    default:
      return "";
  }
};

const resolveMiteigentumFraction: StepResolver = (value) => {
  if (!value) return <></>;
  invariant(
    "wirtschaftlicheEinheitZaehler" in value,
    "Only use for miteigentumsanteil fields"
  );
  return (
    value.wirtschaftlicheEinheitZaehler +
    " / " +
    value.wirtschaftlicheEinheitNenner
  );
};

const resolveFlurstueckGroesse: StepResolver = (value) => {
  if (!value) return <></>;
  invariant("groesseQm" in value, "Only use for groesse fields");
  return calculateGroesse({
    groesseHa: value.groesseHa || "",
    groesseA: value.groesseA || "",
    groesseQm: value.groesseQm || "",
  });
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

const resolveAdresse: StepResolver = (value) => {
  if (!value) return <></>;
  invariant("strasse" in value, "Only use for grundstueck fields");
  return (
    <div className="flex flex-col">
      <div>
        {value.strasse} {value.hausnummer}
      </div>
      <div>{value.zusatzangaben}</div>
      <div>
        {value.plz} {value.ort}
      </div>
      <div>{resolveBundesland(value.bundesland)}</div>
    </div>
  );
};

const resolveBodenrichtwertAnzahl: FieldResolver = (value) => {
  switch (value) {
    case "1":
      return "Ein Bodenrichtwert";
    case "2":
      return "Zwei Bodenrichtwerte";
    default:
      return "";
  }
};

const resolveFlurstueckFraction: StepResolver = (value) => {
  if (!value) return <></>;
  invariant("flurstueckZaehler" in value, "Only use for flur fields");
  return (
    value.flurstueckZaehler +
    (value.flurstueckNenner ? " / " + value.flurstueckNenner : "")
  );
};

const EnumerationFields = ({
  id,
  index,
  label,
  icon,
  children,
}: {
  id: string;
  index: number;
  label: string;
  icon: ReactNode;
  children: ReactNode;
}) => {
  return (
    <div id={id}>
      <div className="bg-gray-300 flex flex-row p-10 w-fit items-center mb-16">
        <div className="mr-10">{icon}</div>
        <h3 className="font-bold uppercase text-10 text-gray-900">
          {label} {index + 1}
        </h3>
      </div>
      <ul className="ml-64">{children}</ul>
    </div>
  );
};

export type ZusammenfassungAccordionProps = {
  allData: GrundModel;
  i18n: I18nObject;
  errors?: PreviousStepsErrors;
};

type FieldResolver = (field: string | undefined) => string;
type StepResolver = (
  field:
    | GrundstueckAdresseFields
    | GrundstueckFlurstueckFlurFields
    | GrundstueckFlurstueckMiteigentumsanteilFields
    | GrundstueckFlurstueckGroesseFields
    | undefined
) => ReactNode;

export default function ZusammenfassungAccordion({
  allData,
  i18n,
  errors,
}: ZusammenfassungAccordionProps) {
  const editLink = (editUrl: string) => {
    return (
      <a
        href={editUrl}
        className="text-14 font-bold underline flex flex-row items-center"
      >
        <Edit className="mr-10" />
        Ändern
      </a>
    );
  };

  type ItemProps = {
    label: string;
    path: string;
    resolver?: FieldResolver | StepResolver;
    explicitValue?: string;
  };

  const stepItem = (
    pathToStep: string,
    fieldItems: ItemProps[],
    isFirst?: boolean
  ): JSX.Element => {
    const editUrl = `${pathToStep}?redirectToSummary=true`;

    const fieldNodes = fieldItems.map((fieldItem, index) => {
      const completeFieldPath =
        pathToStep + (fieldItem.path ? "." + fieldItem.path : "");
      let value = getStepData(allData, completeFieldPath);
      const error = errors ? getStepData(errors, completeFieldPath) : undefined;
      if (fieldItem.explicitValue) value = fieldItem.explicitValue;
      const displayValue = fieldItem.resolver
        ? fieldItem.resolver(value)
        : value;

      if (!displayValue && !error) return undefined;
      return (
        <li className={classNames({ "mb-16": index != fieldItems.length - 1 })}>
          <dl>
            <dt className="font-bold block uppercase text-10 mb-4">
              {fieldItem.label}
            </dt>
            <dd className="block">{error ? error : displayValue}</dd>
          </dl>
        </li>
      );
    });
    if (_.compact(fieldNodes).length == 0) return <></>;

    return (
      <li>
        {!isFirst && <hr className="my-16" />}
        <div className="mb-16 flex flex-row">
          <div className="flex flex-row w-full justify-between items-start">
            <ul>{fieldNodes}</ul>
            {editLink(editUrl)}
          </div>
        </div>
      </li>
    );
  };

  const item = (
    label: string,
    path: string,
    resolver?: FieldResolver | StepResolver,
    explicitValue?: string
  ): JSX.Element => {
    let value = getStepData(allData, path);
    const error = errors ? getStepData(errors, path) : undefined;
    if (explicitValue) value = explicitValue;

    const displayValue = resolver ? resolver(value) : value;

    if (displayValue || error) {
      return (
        <li>
          <div className="mb-16 flex flex-row">
            <div className="flex flex-row w-full justify-between items-start">
              <dl>
                <dt className="font-bold block uppercase text-10 mb-4">
                  {label}
                </dt>
                <dd className="block">{error ? error : displayValue}</dd>
              </dl>
            </div>
          </div>
        </li>
      );
    } else {
      return <></>;
    }
  };

  const sectionHeading = (label: string, dataKey: string) => {
    const finishedIcon = errors?.[dataKey] ? (
      <Unfinished className="mr-16" />
    ) : (
      <Finished className="mr-16" />
    );

    return (
      <div className="flex">
        {finishedIcon}
        <h2 className="font-bold text-2xl mb-3">{label}</h2>
      </div>
    );
  };

  const unfilledAccordionItemContent = (sectionIdentifier: string) => {
    return (
      <div
        id={`${sectionIdentifier}-area`}
        data-testid={`${sectionIdentifier}-area`}
        className="mb-16 flex flex-row w-full justify-between items-center"
      >
        {i18n.specifics.sectionUnfilled}
        {editLink(`${sectionIdentifier}/uebersicht`)}
      </div>
    );
  };

  const grundstueckAccordionItem = (): AccordionItem => {
    const header = sectionHeading("Grundstück", "grundstueck");
    if (!allData.grundstueck) {
      return {
        header,
        content: unfilledAccordionItemContent("grundstueck"),
      };
    }
    return {
      header,
      content: (
        <div id="grundstueck-area" data-testid="grundstueck-area">
          <ul>
            {stepItem(
              "grundstueck.typ",
              [
                {
                  label: "Art des Grundstücks",
                  path: "typ",
                  resolver: resolveGrundstueckTyp,
                },
              ],
              true
            )}
            {stepItem("grundstueck.adresse", [
              {
                label: "Adresse",
                path: "",
                resolver: resolveAdresse,
              },
            ])}
            {stepItem("grundstueck.steuernummer", [
              {
                label: "Steuernummer/Aktenzeichen",
                path: "steuernummer",
              },
            ])}
            {stepItem("grundstueck.abweichendeEntwicklung", [
              {
                label: "Abweichende Entwicklung",
                path: "zustand",
                resolver: resolveAbweichendeEntwicklung,
              },
            ])}
            {stepItem("grundstueck.gemeinde", [
              {
                label: "Innerhalb einer Gemeinde",
                path: "innerhalbEinerGemeinde",
                resolver: resolveJaNein,
              },
            ])}
            {stepItem("grundstueck.anzahl", [
              {
                label: "Anzahl der Grundstückseinheiten",
                path: "anzahl",
              },
            ])}
            {allData.grundstueck.anzahl?.anzahl && (
              <>
                {[
                  ...Array(
                    Number.parseInt(allData.grundstueck.anzahl.anzahl)
                  ).keys(),
                ].map((index) => {
                  const flurstueckKey = "flurstueck-" + index;
                  return (
                    <EnumerationFields
                      index={index}
                      label="Angaben zu Flurstück"
                      icon={<House fill="#4E596A" />}
                      key={flurstueckKey}
                      id={flurstueckKey}
                    >
                      {stepItem(
                        `grundstueck.flurstueck.${index + 1}.angaben`,
                        [
                          {
                            label: "Grundbuchblattnummer",
                            path: "grundbuchblattnummer",
                          },
                          {
                            label: "Gemarkung",
                            path: "gemarkung",
                          },
                        ],
                        true
                      )}
                      {stepItem(`grundstueck.flurstueck.${index + 1}.flur`, [
                        {
                          label: "Flur",
                          path: "flur",
                        },
                        {
                          label: "Flurstück",
                          path: "",
                          resolver: resolveFlurstueckFraction,
                        },
                      ])}
                      {stepItem(
                        `grundstueck.flurstueck.${index + 1}.miteigentum`,
                        [
                          {
                            label: "Auswahl Miteigentum",
                            path: "hasMiteigentum",
                            resolver: resolveMiteigentum,
                          },
                        ]
                      )}
                      {stepItem(
                        `grundstueck.flurstueck.${
                          index + 1
                        }.miteigentumsanteil`,
                        [
                          {
                            label: "Miteigentumsanteil",
                            path: "",
                            resolver: resolveMiteigentumFraction,
                          },
                        ]
                      )}
                      {stepItem(`grundstueck.flurstueck.${index + 1}.groesse`, [
                        {
                          label: "Gesamtgröße",
                          path: "",
                          resolver: resolveFlurstueckGroesse,
                        },
                      ])}
                    </EnumerationFields>
                  );
                })}
              </>
            )}
            {stepItem("grundstueck.bodenrichtwertEingabe", [
              {
                label: "Bodenrichtwert in Euro",
                path: "bodenrichtwert",
              },
            ])}
            {stepItem("grundstueck.bodenrichtwertAnzahl", [
              {
                label: "Anzahl Bodenrichtwert",
                path: "anzahl",
                resolver: resolveBodenrichtwertAnzahl,
              },
            ])}
          </ul>
        </div>
      ),
    };
  };

  const gebaeudeAccordionItem = (): AccordionItem | undefined => {
    if (!conditions.isBebaut(allData)) return undefined;

    const header = sectionHeading("Gebäude", "gebaeude");
    if (!allData?.gebaeude) {
      return {
        header,
        content: unfilledAccordionItemContent("gebaeude"),
      };
    }
    return {
      header,
      content: (
        <div id="gebaeude-area" data-testid="gebaeude-area">
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
            {item(
              "Grundstück hat Garagen",
              "gebaeude.garagen.hasGaragen",
              resolveJaNein
            )}
            {conditions.hasGaragen
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
    };
  };

  const eigentuemerAccordionItem = (): AccordionItem => {
    const header = sectionHeading("Eigentümer:innen", "eigentuemer");
    if (!allData?.eigentuemer) {
      return {
        header,
        content: unfilledAccordionItemContent("eigentuemer"),
      };
    }
    return {
      header,
      content: (
        <div id="eigentuemer-area" data-testid="eigentuemer-area">
          <ul>
            {item("Anzahl", "eigentuemer.anzahl.anzahl")}
            {item(
              "Verheiratet",
              "eigentuemer.verheiratet.areVerheiratet",
              resolveJaNein
            )}
          </ul>
          {allData.eigentuemer.anzahl?.anzahl && (
            <>
              {[
                ...Array(
                  Number.parseInt(allData.eigentuemer.anzahl.anzahl)
                ).keys(),
              ].map((index) => {
                const personKey = "person-" + index;
                return (
                  <EnumerationFields
                    index={index}
                    label="Eigentümer:in"
                    icon={<Person fill="#4E596A" />}
                    key={personKey}
                    id={personKey}
                  >
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
                      `eigentuemer.person.${index + 1}.persoenlicheAngaben.name`
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
                    {item("PLZ", `eigentuemer.person.${index + 1}.adresse.plz`)}
                    {item("Ort", `eigentuemer.person.${index + 1}.adresse.ort`)}
                    {item(
                      "Telefonnummer",
                      `eigentuemer.person.${index + 1}.adresse.telefonnummer`
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

                    {conditions.hasGesetzlicherVertreter({
                      ...allData,
                      personId: index + 1,
                    }) && (
                      <div className="ml-64" id={personKey + "-vertreter"}>
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

                    {item(
                      "Anteil Zähler",
                      `eigentuemer.person.${index + 1}.anteil.zaehler`
                    )}
                    {item(
                      "Anteil Nenner",
                      `eigentuemer.person.${index + 1}.anteil.nenner`
                    )}
                  </EnumerationFields>
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
            {conditions.customBruchteilsgemeinschaftData(allData) && (
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
            {(conditions.hasEmpfangsbevollmaechtigter(allData) ||
              conditions.isBruchteilsgemeinschaft(allData)) && (
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
    };
  };

  const accordionItems = [
    grundstueckAccordionItem(),
    gebaeudeAccordionItem(),
    eigentuemerAccordionItem(),
  ].filter((i) => i !== undefined) as AccordionItem[];

  return <Accordion items={accordionItems} />;
}
