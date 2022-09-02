import { Factory } from "fishery";
import _ from "lodash";
import {
  EigentuemerAnzahlFields,
  EigentuemerPersonGesetzlicherVertreterFields,
  Flurstueck,
  GrundstueckAbweichendeEntwicklungFields,
  GrundstueckAdresseFields,
  GrundstueckAnzahlFields,
  GrundstueckBodenrichtwertEingabeFields,
  GrundstueckGemeindeFields,
  GrundstueckSteuernummerFields,
  GrundstueckTypFields,
  Person,
} from "~/domain/steps";
import { GebaeudeAb1949Fields } from "~/domain/steps/gebaeude/ab1949";
import { GebaeudeKernsaniertFields } from "~/domain/steps/gebaeude/kernsaniert";
import { GebaeudeWeitereWohnraeumeFields } from "~/domain/steps/gebaeude/weitereWohnraeume";
import { GebaeudeGaragenFields } from "~/domain/steps/gebaeude/garagen";
import { EigentuemerVerheiratetFields } from "~/domain/steps/eigentuemer/verheiratet";
import { EigentuemerEmpfangsvollmachtFields } from "~/domain/steps/eigentuemer/empfangsvollmacht";
import { flurstueckFactory } from "./flurstueck";
import { EigentuemerPersonAdresseFields } from "~/domain/steps/eigentuemer/person/adresse";
import { EigentuemerBruchteilsgemeinschaftFields } from "~/domain/steps/eigentuemer/bruchteilsgemeinschaft";
import { GebaeudeBaujahrFields } from "~/domain/steps/gebaeude/baujahr";
import { GebaeudeKernsanierungsjahrFields } from "~/domain/steps/gebaeude/kernsanierungsjahr";
import { GebaeudeAbbruchverpflichtungFields } from "~/domain/steps/gebaeude/abbruchverpflichtung";
import { GebaeudeAbbruchverpflichtungsjahrFields } from "~/domain/steps/gebaeude/abbruchverpflichtungsjahr";
import { GebaeudeWohnflaecheFields } from "~/domain/steps/gebaeude/wohnflaeche";
import { GebaeudeWohnflaechenFields } from "~/domain/steps/gebaeude/wohnflaechen";
import { GebaeudeWeitereWohnraeumeDetailsFields } from "~/domain/steps/gebaeude/weitereWohnraeumeDetails";
import { GebaeudeGaragenAnzahlFields } from "~/domain/steps/gebaeude/garagenAnzahl";
import { EigentuemerBruchteilsgemeinschaftAngabenFields } from "~/domain/steps/eigentuemer/bruchteilsgemeinschaftangaben/angaben";
import { EigentuemerEmpfangsbevollmaechtigterNameFields } from "~/domain/steps/eigentuemer/empfangsbevollmaechtigter/name";
import { EigentuemerEmpfangsbevollmaechtigterAdresseFields } from "~/domain/steps/eigentuemer/empfangsbevollmaechtigter/adresse";
import { ZusammenfassungFields } from "~/domain/steps/zusammenfassung";
import { GrundstueckBodenrichtwertAnzahlFields } from "~/domain/steps/grundstueck/bodenrichtwert/anzahl";
import { GrundstueckFlurstueckMiteigentumsanteilFields } from "~/domain/steps/grundstueck/miteigentumsanteil";
import { GrundstueckMiteigentumAuswahlHausFields } from "~/domain/steps/grundstueck/miteigentum/miteigentumAuswahlHaus";
import { StateMachineContext } from "~/domain/states/states";
import { GrundstueckMiteigentumAuswahlWohnungFields } from "~/domain/steps/grundstueck/miteigentum/miteigentumAuswahlWohnung";
import { testFeaturesEnabled } from "~/util/testFeaturesEnabled";

type PersonTransientParams = {
  transient: {
    personIndex: number;
  };
};

const strasse = _.sample([
  "Hauptstraße",
  "Tal",
  "P4",
  "Straße 254",
  "Bischöflich-Geistlicher-Rat-Josef-Zinnbauer-Straße",
  "Laehr'scher Jagdweg",
  "Rue d'Achères",
]);
const hausnummer = _.sample(["1", "42", "9999"]);
const plz = _.sample(["01001", "90329"]);
const ort = _.sample([
  "Hausen",
  "Au",
  "Hellschen-Heringsand-Unterschaar",
  "Petershagen/Eggersdorf",
  "St. Leon-Rot",
]);

class GrundModelFactory extends Factory<StateMachineContext> {
  grundstueckAdresse(fields?: Partial<GrundstueckAdresseFields>) {
    return this.params({
      grundstueck: {
        adresse: {
          strasse,
          hausnummer,
          zusatzangaben: "something",
          plz,
          ort,
          ...fields,
        },
      },
    });
  }

  grundstueckSteuernummer(fields?: Partial<GrundstueckSteuernummerFields>) {
    return this.params({
      grundstueck: {
        steuernummer: {
          steuernummer: "1234567890",
          ...fields,
        },
      },
    });
  }

  grundstueckTyp(fields?: Partial<GrundstueckTypFields>) {
    return this.params({
      grundstueck: {
        typ: {
          typ: fields ? fields.typ : "einfamilienhaus",
          ...fields,
        },
      },
    });
  }

  grundstueckAbweichendeEntwicklung(
    fields?: Partial<GrundstueckAbweichendeEntwicklungFields>
  ) {
    return this.params({
      grundstueck: {
        abweichendeEntwicklung: {
          zustand: "bauerwartungsland",
          ...fields,
        },
      },
    });
  }

  grundstueckGemeinde(fields?: Partial<GrundstueckGemeindeFields>) {
    return this.params({
      grundstueck: {
        gemeinde: {
          innerhalbEinerGemeinde: "true",
          ...fields,
        },
      },
    });
  }

  grundstueckAnzahl(fields?: Partial<GrundstueckAnzahlFields>) {
    return this.params({
      grundstueck: {
        anzahl: {
          anzahl: "2",
          ...fields,
        },
      },
    });
  }

  grundstueckFlurstueck({
    list,
    count,
  }: {
    list?: Flurstueck[];
    count?: number;
  }) {
    const flurstueckList =
      list ||
      flurstueckFactory
        .angaben()
        .flur()
        .groesse()
        .buildList(count || 1);

    return this.params({
      grundstueck: {
        flurstueck: flurstueckList,
      },
    });
  }

  miteigentumHaus(fields?: Partial<GrundstueckMiteigentumAuswahlHausFields>) {
    return this.params({
      grundstueck: {
        miteigentumAuswahlHaus: {
          hasMiteigentum: "false",
          ...fields,
        },
      },
    });
  }

  miteigentumWohnung(
    fields?: Partial<GrundstueckMiteigentumAuswahlWohnungFields>
  ) {
    return this.params({
      grundstueck: {
        miteigentumAuswahlWohnung: {
          miteigentumTyp: "none",
          ...fields,
        },
      },
    });
  }

  miteigentumsanteil(
    fields?: Partial<GrundstueckFlurstueckMiteigentumsanteilFields>
  ) {
    return this.params({
      grundstueck: {
        miteigentumsanteil: {
          wirtschaftlicheEinheitZaehler: "1",
          wirtschaftlicheEinheitNenner: "234",
          ...fields,
        },
      },
    });
  }

  grundstueckBodenrichtwert(
    eingabeFields?: Partial<GrundstueckBodenrichtwertEingabeFields>,
    anzahlFields?: Partial<GrundstueckBodenrichtwertAnzahlFields>
  ) {
    return this.params({
      grundstueck: {
        bodenrichtwertEingabe: {
          bodenrichtwert: "200",
          ...eingabeFields,
        },
        bodenrichtwertAnzahl: {
          anzahl: "1",
          ...anzahlFields,
        },
      },
    });
  }

  miteigentumAuswahl(
    fields?: Partial<GrundstueckMiteigentumAuswahlHausFields>
  ) {
    return this.params({
      grundstueck: {
        miteigentumAuswahlHaus: {
          hasMiteigentum: fields ? fields?.hasMiteigentum : "true",
        },
      },
    });
  }

  gebaeudeAb1949(fields?: Partial<GebaeudeAb1949Fields>) {
    return this.params({
      gebaeude: {
        ab1949: {
          isAb1949: fields ? fields?.isAb1949 : "true",
        },
      },
    });
  }

  gebaeudeBaujahr(fields?: Partial<GebaeudeBaujahrFields>) {
    return this.params({
      gebaeude: {
        baujahr: {
          baujahr: fields?.baujahr,
        },
      },
    });
  }

  kernsaniert(
    fields?: Partial<GebaeudeKernsaniertFields> &
      Partial<GebaeudeKernsanierungsjahrFields>
  ) {
    return this.params({
      gebaeude: {
        kernsaniert: {
          isKernsaniert: fields ? fields?.isKernsaniert : "true",
        },
        kernsanierungsjahr: {
          kernsanierungsjahr: fields ? fields?.kernsanierungsjahr : "",
        },
      },
    });
  }

  abbruchverpflichtung(
    fields?: Partial<GebaeudeAbbruchverpflichtungFields> &
      Partial<GebaeudeAbbruchverpflichtungsjahrFields>
  ) {
    return this.params({
      gebaeude: {
        abbruchverpflichtung: {
          hasAbbruchverpflichtung: fields?.hasAbbruchverpflichtung
            ? fields?.hasAbbruchverpflichtung
            : "true",
        },
        abbruchverpflichtungsjahr: {
          abbruchverpflichtungsjahr: fields?.abbruchverpflichtungsjahr
            ? fields.abbruchverpflichtungsjahr
            : "",
        },
      },
    });
  }

  wohnflaechen(
    fields?: Partial<GebaeudeWohnflaecheFields> &
      Partial<GebaeudeWohnflaechenFields>
  ) {
    return this.params({
      gebaeude: {
        wohnflaeche: {
          wohnflaeche: fields?.wohnflaeche ? fields?.wohnflaeche : "",
        },
        wohnflaechen: {
          wohnflaeche1: fields?.wohnflaeche1 ? fields.wohnflaeche1 : "",
          wohnflaeche2: fields?.wohnflaeche2 ? fields.wohnflaeche2 : "",
        },
      },
    });
  }

  withWeitereWohnraeume(
    fields?: Partial<GebaeudeWeitereWohnraeumeFields> &
      Partial<GebaeudeWeitereWohnraeumeDetailsFields>
  ) {
    return this.params({
      gebaeude: {
        weitereWohnraeume: {
          hasWeitereWohnraeume: fields ? fields?.hasWeitereWohnraeume : "true",
        },
        weitereWohnraeumeDetails: {
          anzahl: fields ? fields.anzahl : "",
          flaeche: fields ? fields.flaeche : "",
        },
      },
    });
  }

  withGaragen(
    fields?: Partial<GebaeudeGaragenFields> &
      Partial<GebaeudeGaragenAnzahlFields>
  ) {
    return this.params({
      gebaeude: {
        garagen: {
          hasGaragen: fields ? fields?.hasGaragen : "true",
        },
        garagenAnzahl: {
          anzahlGaragen: fields ? fields.anzahlGaragen : "",
        },
      },
    });
  }

  eigentuemerAnzahl(fields?: Partial<EigentuemerAnzahlFields>) {
    return this.params({
      eigentuemer: {
        anzahl: {
          anzahl: fields?.anzahl || "1",
        },
      },
    });
  }

  eigentuemerVerheiratet(fields?: Partial<EigentuemerVerheiratetFields>) {
    return this.params({
      eigentuemer: {
        verheiratet: {
          areVerheiratet: fields?.areVerheiratet,
        },
      },
    });
  }

  eigentuemerPerson({ list }: { list?: Person[] }) {
    return this.params({
      eigentuemer: {
        person: list,
      },
    });
  }

  eigentuemerPersonAdresse(
    fields?: Partial<EigentuemerPersonAdresseFields>,
    params?: PersonTransientParams
  ) {
    return this.params({
      eigentuemer: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        person: {
          [params?.transient.personIndex || 0]: {
            adresse: fields,
          },
        },
      },
    });
  }

  eigentuemerPersonGesetzlicherVertreter(
    fields?: Partial<EigentuemerPersonGesetzlicherVertreterFields>,
    params?: PersonTransientParams
  ) {
    return this.params({
      eigentuemer: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        person: {
          [params?.transient.personIndex || 0]: {
            gesetzlicherVertreter: {
              hasVertreter: fields?.hasVertreter || "false",
            },
          },
        },
      },
    });
  }

  eigentuemerBruchteilsgemeinschaft(
    fields?: Partial<EigentuemerBruchteilsgemeinschaftFields> &
      Partial<EigentuemerBruchteilsgemeinschaftAngabenFields>
  ) {
    return this.params({
      eigentuemer: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        bruchteilsgemeinschaft: {
          predefinedData: fields?.predefinedData,
        },
        bruchteilsgemeinschaftangaben: {
          angaben: {
            name: fields?.name,
            strasse: fields?.strasse,
            hausnummer: fields?.hausnummer,
            postfach: fields?.postfach,
            plz: fields?.plz,
            ort: fields?.ort,
          },
        },
      },
    });
  }

  eigentuemerEmpfangsvollmacht(
    fields?: Partial<EigentuemerEmpfangsvollmachtFields> &
      Partial<EigentuemerEmpfangsbevollmaechtigterNameFields> &
      Partial<EigentuemerEmpfangsbevollmaechtigterAdresseFields>
  ) {
    return this.params({
      eigentuemer: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        empfangsvollmacht: {
          hasEmpfangsvollmacht: fields?.hasEmpfangsvollmacht || "false",
        },
        empfangsbevollmaechtigter: {
          name: {
            anrede: fields?.anrede,
            titel: fields?.titel,
            vorname: fields?.vorname,
            name: fields?.name,
          },
          adresse: {
            strasse: fields?.strasse,
            hausnummer: fields?.hausnummer,
            postfach: fields?.postfach,
            plz: fields?.plz,
            ort: fields?.ort,
            telefonnummer: fields?.telefonnummer,
          },
        },
      },
    });
  }

  // TODO refactor, use grundstueckAnzahl
  flurstueckAnzahl(fields?: Partial<GrundstueckAnzahlFields>) {
    return this.params({
      grundstueck: {
        anzahl: {
          anzahl: fields?.anzahl || "1",
        },
      },
    });
  }

  freitext(fields?: Partial<ZusammenfassungFields>) {
    return this.params({
      zusammenfassung: {
        freitext: fields?.freitext,
      },
    });
  }

  full() {
    return this.params(
      this.grundstueckTyp({ typ: "einfamilienhaus" })
        .grundstueckAdresse({
          strasse: "GST Strasse",
          hausnummer: "2GST",
          zusatzangaben: "GST Zusatzangaben",
          plz: "12345",
          ort: "GST Ort",
          bundesland: "BB",
        })
        .grundstueckSteuernummer({ steuernummer: "1234567890" })
        .grundstueckAbweichendeEntwicklung({ zustand: "rohbauland" })
        .grundstueckGemeinde({ innerhalbEinerGemeinde: "true" })
        .grundstueckBodenrichtwert({ bodenrichtwert: "123" })
        .miteigentumAuswahl({
          hasMiteigentum: "false",
        })
        .flurstueckAnzahl({ anzahl: "2" })
        .grundstueckFlurstueck({
          list: [
            {
              angaben: {
                grundbuchblattnummer: "1",
                gemarkung: "2",
              },
              flur: {
                flur: "1",
                flurstueckZaehler: "23",
                flurstueckNenner: "45",
              },
              groesse: {
                groesseHa: "",
                groesseA: "",
                groesseQm: "1234",
              },
            },
            {
              angaben: {
                grundbuchblattnummer: "2",
                gemarkung: "3",
              },
              flur: {
                flur: "2",
                flurstueckZaehler: "34",
                flurstueckNenner: "56",
              },
              groesse: {
                groesseHa: "",
                groesseA: "123",
                groesseQm: "45",
              },
            },
          ],
          count: 2,
        })
        .gebaeudeAb1949({ isAb1949: "true" })
        .gebaeudeBaujahr({ baujahr: "2000" })
        .kernsaniert({ isKernsaniert: "true", kernsanierungsjahr: "2001" })
        .abbruchverpflichtung({
          hasAbbruchverpflichtung: "true",
          abbruchverpflichtungsjahr: "2030",
        })
        .wohnflaechen({ wohnflaeche: "100" })
        .withWeitereWohnraeume({
          hasWeitereWohnraeume: "true",
          anzahl: "2",
          flaeche: "200",
        })
        .withGaragen({ hasGaragen: "true", anzahlGaragen: "3" })
        .eigentuemerAnzahl({ anzahl: "2" })
        .eigentuemerVerheiratet({ areVerheiratet: "false" })
        .eigentuemerPerson({
          list: [
            {
              persoenlicheAngaben: {
                anrede: "frau",
                titel: "1 Titel",
                vorname: "1 Vorname",
                name: "1 Name",
                geburtsdatum: "31.01.1111",
              },
              adresse: {
                strasse: "1 Strasse",
                hausnummer: "1 H",
                plz: "12345",
                ort: "1 Ort",
                telefonnummer: "111111",
              },
              steuerId: {
                steuerId: "02293417683",
              },
              gesetzlicherVertreter: {
                hasVertreter: "false",
              },
              anteil: {
                zaehler: "1",
                nenner: "2",
              },
            },
            {
              persoenlicheAngaben: {
                anrede: "herr",
                titel: "2 Titel",
                vorname: "2 Vorname",
                name: "2 Name",
                geburtsdatum: "02.02.2000",
              },
              adresse: {
                postfach: "23",
                plz: "22345",
                ort: "2 Ort",
                telefonnummer: "222222",
              },
              steuerId: {
                steuerId: "04452397687",
              },
              gesetzlicherVertreter: {
                hasVertreter: "true",
              },
              vertreter: {
                name: {
                  anrede: "herr",
                  titel: "VERT Titel",
                  vorname: "VERT Vorname",
                  name: "VERT Name",
                },
                adresse: {
                  strasse: "VERT Strasse",
                  hausnummer: "3VERT",
                  plz: "54321",
                  ort: "VERT Ort",
                  telefonnummer: "333333",
                },
              },
              anteil: {
                zaehler: "3",
                nenner: "4",
              },
            },
          ],
        })
        .eigentuemerBruchteilsgemeinschaft({
          predefinedData: "false",
          name: "BTG Name",
          postfach: "123456",
          plz: "54321",
          ort: "BTG Ort",
        })
        .eigentuemerEmpfangsvollmacht({
          hasEmpfangsvollmacht: "true",
          anrede: "no_anrede",
          titel: "EMP Titel",
          vorname: "EMP Vorname",
          name: "EMP Name",
          strasse: "EMP Strasse",
          hausnummer: "2EMP",
          plz: "24680",
          ort: "EMP Ort",
          telefonnummer: "12345",
        })
        .build()
    );
  }
}

export const grundModelFactory = GrundModelFactory.define(() => ({
  testFeaturesEnabled: testFeaturesEnabled(),
}));
