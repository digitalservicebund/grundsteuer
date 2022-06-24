import { getStepData } from "~/domain/model";
import Finished from "~/components/icons/mui/Finished";
import Edit from "~/components/icons/mui/Edit";
import { conditions } from "~/domain/guards";
import { Accordion, StepFormField } from "~/components";
import { AccordionItemProps } from "~/components/AccordionItem";
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
import { GrundstueckFlurstueckMiteigentumsanteilFields } from "~/domain/steps/grundstueck/miteigentumsanteil";
import {
  calculateGroesse,
  transformBruchteilsgemeinschaftAdresse,
  transformBruchteilsgemeinschaftName,
} from "~/erica/transformData";
import { EigentuemerPersonPersoenlicheAngabenFields } from "~/domain/steps/eigentuemer/person/persoenlicheAngaben";
import { EigentuemerPersonAdresseFields } from "~/domain/steps/eigentuemer/person/adresse";
import { EigentuemerPersonAnteilFields } from "~/domain/steps/eigentuemer/person/anteil";
import { StepFormFieldProps } from "~/components/form/StepFormField";
import Paragraph from "~/components/icons/mui/Paragraph";
import ExclamationMarkFilled from "~/components/icons/mui/ExclamationMarkFilled";
import { EigentuemerBruchteilsgemeinschaftAdresseFields } from "~/domain/steps/eigentuemer/bruchteilsgemeinschaftangaben/angaben";
import SectionLabel from "~/components/SectionLabel";

const resolveAnrede = (value: string | undefined) => {
  if (value === "no_anrede") {
    return "Keine Anrede";
  }
  if (value === "frau") {
    return "Frau";
  }
  if (value === "herr") {
    return "Herr";
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
      return "Eigentumswohnung";
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

const resolveGemeinde: FieldResolver = (value) => {
  switch (value) {
    case "true":
      return "Liegt innerhalb einer Gemeinde";
    case "false":
      return "Läuft über Gemeindegrenzen";
    default:
      return "";
  }
};

const resolveMiteigentumFraction: StepResolver = (value) => {
  if (!value || Object.keys(value).length == 0) return undefined;
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
  if (!value || Object.keys(value).length == 0) return undefined;
  invariant(
    "groesseHa" in value || "groesseA" in value || "groesseQm" in value,
    "Only use for groesse fields"
  );
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
  if (!value || Object.keys(value).length == 0) return undefined;
  invariant("ort" in value, "Only use for adresse fields");
  return (
    <div className="flex flex-col">
      <div>
        {value.strasse} {value.hausnummer}
      </div>
      <div>{"postfach" in value && value.postfach}</div>
      <div>{"zusatzangaben" in value && value.zusatzangaben}</div>
      <div>
        {value.plz} {value.ort}
      </div>
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
  if (!value || Object.keys(value).length == 0) return undefined;
  invariant("flurstueckZaehler" in value, "Only use for flur fields");
  return (
    value.flurstueckZaehler +
    (value.flurstueckNenner ? " / " + value.flurstueckNenner : "")
  );
};

const resolveGebaudeAb1949: FieldResolver = (value) => {
  switch (value) {
    case "true":
      return "Nach 1949";
    case "false":
      return "Vor 1949";
    default:
      return "";
  }
};

const resolveKernsanierung: FieldResolver = (value) => {
  switch (value) {
    case "true":
      return "Gebäude wurde kernsaniert";
    case "false":
      return "Gebäude wurde nicht kernsaniert";
    default:
      return "";
  }
};

const resolveAbbruch: FieldResolver = (value) => {
  switch (value) {
    case "true":
      return "Es liegt eine Abbruchverpflichtung vor";
    case "false":
      return "Es liegt keine Abbruchverpflichtung vor";
    default:
      return "";
  }
};

const resolveWeitereWohnraeume: FieldResolver = (value) => {
  switch (value) {
    case "true":
      return "Es existieren weitere Wohnräume auf diesem Grundstück";
    case "false":
      return "Es existieren keine weiteren Wohnräume auf diesem Grundstück";
    default:
      return "";
  }
};

const resolveGaragen: FieldResolver = (value) => {
  switch (value) {
    case "true":
      return "Es gibt eine oder mehrere Garagen";
    case "false":
      return "Es gibt keine Garagen";
    default:
      return "";
  }
};

const resolveVerheiratet: FieldResolver = (value) => {
  switch (value) {
    case "true":
      return "Verheiratet / In eingetragener Lebenspartnerschaft";
    case "false":
      return "Nicht verheiratet / in eingetragener Lebenspartnerschaft";
    default:
      return "";
  }
};

const resolvePersoenlicheAngaben: StepResolver = (value) => {
  if (!value || Object.keys(value).length == 0) return undefined;
  invariant("anrede" in value, "Only use for persoenlicheAngaben fields");
  return (
    <div className="flex flex-col">
      <div>{resolveAnrede(value.anrede)}</div>
      <div>
        {value.titel} {value.vorname} {value.name}
      </div>
    </div>
  );
};

const resolveGesetzlicherVertreter: FieldResolver = (value) => {
  switch (value) {
    case "true":
      return "Hat gesetzliche Vertretung";
    case "false":
      return "Keine gesetzliche Vertretung";
    default:
      return "";
  }
};

const resolveAnteilFraction: StepResolver = (value) => {
  if (!value || Object.keys(value).length == 0) return undefined;
  invariant("zaehler" in value, "Only use for flur fields");
  return value.zaehler + " / " + value.nenner;
};

const resolveBruchteilsgemeinschaftName: StepResolver = (_value, allData) => {
  const grundstueckAdresse = allData?.grundstueck?.adresse;
  if (grundstueckAdresse) {
    return transformBruchteilsgemeinschaftName(grundstueckAdresse);
  }
  return "";
};

const resolveBruchteilsgemeinschaftAdresse: StepResolver = (
  _value,
  allData
) => {
  const eigentuemerAdresse = allData?.eigentuemer?.person?.[0].adresse;
  if (eigentuemerAdresse) {
    return resolveAdresse(
      transformBruchteilsgemeinschaftAdresse(eigentuemerAdresse)
    );
  }
  return "";
};

const resolveEmpfangsvollmacht: FieldResolver = (value) => {
  switch (value) {
    case "true":
      return "Hat empfangsbevollmächtigte Person";
    case "false":
      return "Hat keine empfangsbevollmächtigte Person";
    default:
      return "";
  }
};

const pathToStepUrl = (path: string): string => {
  return `formular/${path.split(".").join("/")}`;
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
      <SectionLabel icon={icon} label={label + " " + (index + 1)} />
      <ul className="ml-64">{children}</ul>
    </div>
  );
};

const IndentedFields = ({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) => {
  return (
    <div className="ml-64" id={id}>
      {children}
    </div>
  );
};

export type ZusammenfassungAccordionProps = {
  allData: GrundModel;
  i18n: I18nObject;
  errors?: PreviousStepsErrors;
  freitextFieldProps: StepFormFieldProps;
};

type FieldResolver = (field: string | undefined) => string;
type StepResolver = (
  field:
    | GrundstueckAdresseFields
    | GrundstueckFlurstueckFlurFields
    | GrundstueckFlurstueckMiteigentumsanteilFields
    | GrundstueckFlurstueckGroesseFields
    | EigentuemerPersonPersoenlicheAngabenFields
    | EigentuemerPersonAdresseFields
    | EigentuemerPersonAnteilFields
    | EigentuemerBruchteilsgemeinschaftAdresseFields
    | undefined,
  allData?: GrundModel
) => ReactNode;

export default function ZusammenfassungAccordion({
  allData,
  i18n,
  errors,
  freitextFieldProps,
}: ZusammenfassungAccordionProps) {
  const editLink = (editUrl: string) => {
    return (
      <a
        href={editUrl}
        className="text-14 font-bold underline flex flex-row items-center"
      >
        <Edit className="mr-10 ml-8" />
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
    const editUrl = `${pathToStepUrl(pathToStep)}?redirectToSummary=true`;

    const fieldNodes = fieldItems.map((fieldItem, index) => {
      const completeFieldPath =
        pathToStep + (fieldItem.path ? "." + fieldItem.path : "");
      let value = getStepData(allData, completeFieldPath);
      let error = errors && getStepData(errors, completeFieldPath);
      if (_.isObject(error)) {
        // in case fieldItem.path is empty
        error = Object.values(error)[0];
      }
      if (fieldItem.explicitValue) value = fieldItem.explicitValue;
      const displayValue = fieldItem.resolver
        ? fieldItem.resolver(value, allData)
        : value;

      if (!displayValue && !error) return undefined;
      return (
        <li
          key={index}
          className={classNames({
            "mb-16": index != fieldItems.length - 1,
            "text-red-800": error,
          })}
        >
          <dl>
            <dt className="flex flex-row items-center font-bold block uppercase text-11 tracking-1 mb-4">
              {error && (
                <ExclamationMarkFilled className="mr-10 min-w-[20px]" />
              )}
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
        {!isFirst && <hr className="my-16 border-gray-400" />}
        <div className="mb-16 last:mb-0 flex flex-row">
          <div className="flex flex-row w-full justify-between items-start">
            <ul>{fieldNodes}</ul>
            {editLink(editUrl)}
          </div>
        </div>
      </li>
    );
  };

  const sectionHeading = (label: string, dataKey: string) => {
    const finishedIcon = errors?.[dataKey] ? (
      <ExclamationMarkFilled className="mr-16" />
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
        className="flex flex-row w-full justify-between items-center"
      >
        {i18n.specifics.sectionUnfilled}
        {editLink(`${sectionIdentifier}/uebersicht`)}
      </div>
    );
  };

  const grundstueckAccordionItem = (): AccordionItemProps => {
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
            {stepItem("grundstueck.abweichendeEntwicklung", [
              {
                label: "Zustand Abweichende Entwicklung",
                path: "zustand",
                resolver: resolveAbweichendeEntwicklung,
              },
            ])}
            {stepItem("grundstueck.adresse", [
              {
                label: "Bundesland",
                path: "bundesland",
                resolver: resolveBundesland,
              },
            ])}
            {stepItem("grundstueck.adresse", [
              {
                label: "Adresse",
                path: "",
                resolver: resolveAdresse,
              },
            ])}
            {stepItem("grundstueck.steuernummer", [
              {
                label: "Steuernummer / Aktenzeichen",
                path: "steuernummer",
              },
            ])}
            {stepItem("grundstueck.gemeinde", [
              {
                label: "Gemeindezugehörigkeit",
                path: "innerhalbEinerGemeinde",
                resolver: resolveGemeinde,
              },
            ])}
            {stepItem("grundstueck.anzahl", [
              {
                label: "Anzahl der Grundstücksflächen",
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
                      label="Angaben zu Grundstücksfläche"
                      icon={<House fill="#4E596A" />}
                      key={flurstueckKey}
                      id={flurstueckKey}
                    >
                      {stepItem(
                        `grundstueck.flurstueck.${index + 1}.angaben`,
                        [
                          {
                            label: "Nummer Grundbuchblatt",
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
                      {stepItem(`grundstueck.flurstueck.${index + 1}.groesse`, [
                        {
                          label: "Gesamtgrösße in Quadratmetern",
                          path: "",
                          resolver: resolveFlurstueckGroesse,
                        },
                      ])}
                    </EnumerationFields>
                  );
                })}
              </>
            )}

            {stepItem(`grundstueck.miteigentumsanteil`, [
              {
                label: "Miteigentumsanteil",
                path: "",
                resolver: resolveMiteigentumFraction,
              },
            ])}
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

  const gebaeudeAccordionItem = (): AccordionItemProps | undefined => {
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
            {stepItem(
              "gebaeude.ab1949",
              [
                {
                  label: "Auswahl Baujahr",
                  path: "isAb1949",
                  resolver: resolveGebaudeAb1949,
                },
              ],
              true
            )}
            {stepItem("gebaeude.baujahr", [
              {
                label: "Baujahr",
                path: "baujahr",
              },
            ])}
            {stepItem("gebaeude.kernsaniert", [
              {
                label: "Auswahl Kernsanierung",
                path: "isKernsaniert",
                resolver: resolveKernsanierung,
              },
            ])}
            {stepItem("gebaeude.kernsanierungsjahr", [
              {
                label: "Jahr der Kernsanierung",
                path: "kernsanierungsjahr",
              },
            ])}
            {stepItem("gebaeude.abbruchverpflichtung", [
              {
                label: "Auswahl Abbruchverpflichtung",
                path: "hasAbbruchverpflichtung",
                resolver: resolveAbbruch,
              },
            ])}
            {stepItem("gebaeude.abbruchverpflichtungsjahr", [
              {
                label: "Jahr der Abbruchverpflichtung",
                path: "abbruchverpflichtungsjahr",
              },
            ])}
            {stepItem("gebaeude.wohnflaeche", [
              {
                label: "Gesamtwohnfläche in Quaratmetern",
                path: "wohnflaeche",
              },
            ])}
            {stepItem("gebaeude.wohnflaechen", [
              {
                label: "Wohnung 1 - Gesamtwohnfäche in Quaratmetern",
                path: "wohnflaeche1",
              },
              {
                label: "Wohnung 2 - Gesamtwohnfäche in Quaratmetern",
                path: "wohnflaeche2",
              },
            ])}
            {stepItem("gebaeude.weitereWohnraeume", [
              {
                label: "Auswahl weitere Wohnräume",
                path: "hasWeitereWohnraeume",
                resolver: resolveWeitereWohnraeume,
              },
            ])}
            {stepItem("gebaeude.weitereWohnraeumeDetails", [
              {
                label: "Auswahl Anzahl weitere Wohnflächen",
                path: "anzahl",
              },
              {
                label: "Gesamtgröße in Quadratmetern",
                path: "flaeche",
              },
            ])}
            {stepItem("gebaeude.garagen", [
              {
                label: "Auswahl Garagen",
                path: "hasGaragen",
                resolver: resolveGaragen,
              },
            ])}
            {stepItem("gebaeude.garagenAnzahl", [
              {
                label: "Anzahl Garagen",
                path: "anzahlGaragen",
              },
            ])}
          </ul>
        </div>
      ),
    };
  };

  const eigentuemerAccordionItem = (): AccordionItemProps => {
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
            {stepItem(
              "eigentuemer.anzahl",
              [
                {
                  label: "Anzahl Eigentümer:innen",
                  path: "anzahl",
                },
              ],
              true
            )}
            {stepItem("eigentuemer.verheiratet", [
              {
                label: "Beziehungsstatus der Eigentümer:innen",
                path: "areVerheiratet",
                resolver: resolveVerheiratet,
              },
            ])}
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
                    {stepItem(
                      `eigentuemer.person.${index + 1}.persoenlicheAngaben`,
                      [
                        {
                          label: "Persönliche Angaben",
                          path: "",
                          resolver: resolvePersoenlicheAngaben,
                        },
                        {
                          label: "Geburtsdatum",
                          path: "geburtsdatum",
                        },
                      ],
                      true
                    )}
                    {stepItem(`eigentuemer.person.${index + 1}.adresse`, [
                      {
                        label: "Postadresse",
                        path: "",
                        resolver: resolveAdresse,
                      },
                      {
                        label: "Telefonnummer",
                        path: "telefonnummer",
                      },
                    ])}
                    {stepItem(`eigentuemer.person.${index + 1}.steuerId`, [
                      {
                        label: "Steuer-ID",
                        path: "steuerId",
                      },
                    ])}
                    {stepItem(
                      `eigentuemer.person.${index + 1}.gesetzlicherVertreter`,
                      [
                        {
                          label: "Auswahl gesetzliche Vertretung",
                          path: "hasVertreter",
                          resolver: resolveGesetzlicherVertreter,
                        },
                      ]
                    )}

                    {conditions.hasGesetzlicherVertreter({
                      ...allData,
                      personId: index + 1,
                    }) && (
                      <IndentedFields id={personKey + "-vertreter"}>
                        <ul>
                          {stepItem(
                            `eigentuemer.person.${index + 1}.vertreter.name`,
                            [
                              {
                                label:
                                  "Persönliche Angaben Gesetzliche:r Vertreter:in",
                                path: "",
                                resolver: resolvePersoenlicheAngaben,
                              },
                            ]
                          )}
                          {stepItem(
                            `eigentuemer.person.${index + 1}.vertreter.adresse`,
                            [
                              {
                                label: "Adresse Gesetzliche:r Vertreter:in",
                                path: "",
                                resolver: resolveAdresse,
                              },
                              {
                                label: "Telefonnummer",
                                path: "telefonnummer",
                              },
                            ]
                          )}
                        </ul>
                      </IndentedFields>
                    )}
                    {stepItem(`eigentuemer.person.${index + 1}.anteil`, [
                      {
                        label: "Anteil am Eigentum",
                        path: "",
                        resolver: resolveAnteilFraction,
                      },
                    ])}
                  </EnumerationFields>
                );
              })}
            </>
          )}
          <ul>
            {conditions.isBruchteilsgemeinschaft(allData) &&
              !conditions.customBruchteilsgemeinschaftData(allData) && (
                <div id={"bruchteilsgemeinschaft"}>
                  {stepItem("eigentuemer.bruchteilsgemeinschaft", [
                    {
                      label: "Name Bruchteilsgemeinschaft",
                      path: "",
                      resolver: resolveBruchteilsgemeinschaftName,
                    },
                    {
                      label: "Adresse",
                      path: "",
                      resolver: resolveBruchteilsgemeinschaftAdresse,
                    },
                  ])}
                </div>
              )}
            {conditions.customBruchteilsgemeinschaftData(allData) && (
              <div id={"bruchteilsgemeinschaft"}>
                <ul>
                  {stepItem(
                    "eigentuemer.bruchteilsgemeinschaftangaben.angaben",
                    [
                      {
                        label: "Name Bruchteilsgemeinschaft",
                        path: "name",
                      },
                      {
                        label: "Adresse",
                        path: "",
                        resolver: resolveAdresse,
                      },
                    ]
                  )}
                </ul>
              </div>
            )}
          </ul>
          <ul>
            {stepItem("eigentuemer.empfangsvollmacht", [
              {
                label: "Empfangsbevollmächtigte Person",
                path: "hasEmpfangsvollmacht",
                resolver: resolveEmpfangsvollmacht,
              },
            ])}
            {(conditions.hasEmpfangsbevollmaechtigter(allData) ||
              conditions.isBruchteilsgemeinschaft(allData)) && (
              <IndentedFields id="empfangsbevollmaechtigter">
                <ul>
                  {stepItem("eigentuemer.empfangsbevollmaechtigter.name", [
                    {
                      label:
                        "Persönliche Angaben Empfangsbevollmächtigte Person",
                      path: "",
                      resolver: resolvePersoenlicheAngaben,
                    },
                  ])}
                  {stepItem("eigentuemer.empfangsbevollmaechtigter.adresse", [
                    {
                      label: "Adresse Empfangsbevollmächtigte Person",
                      path: "",
                      resolver: resolveAdresse,
                    },
                    {
                      label: "Telefonnummer",
                      path: "telefonnummer",
                    },
                  ])}
                </ul>
              </IndentedFields>
            )}
          </ul>
        </div>
      ),
    };
  };

  const freitextAccordionItem = (): AccordionItemProps => {
    return {
      header: (
        <div className="flex items-center">
          <Paragraph className="mr-16" />
          <h2 className="font-bold text-2xl mb-3">Ergänzende Angaben</h2>
        </div>
      ),
      content: (
        <div className="max-w-[400px]">
          <p className="text-16 pb-24">
            Wenn Sie hier Angaben ergänzen, wird Ihre Erklärung von den
            Mitarbeitenden des Finanzamts bearbeitet und nicht maschinell.
            Machen Sie eine Eintragung nur, wenn weitere oder abweichende
            Angaben oder Sachverhalte berücksichtigt werden sollen.
          </p>
          <StepFormField {...freitextFieldProps} />
        </div>
      ),
    };
  };

  const accordionItems = [
    grundstueckAccordionItem(),
    gebaeudeAccordionItem(),
    eigentuemerAccordionItem(),
    freitextAccordionItem(),
  ].filter((i) => i !== undefined) as AccordionItemProps[];

  return <Accordion items={accordionItems} />;
}
