/// <reference types="cypress" />

const inputData = {
  grundsteuck: {
    typ: {
      typ: "einfamilienhaus",
    },
  },
  gebaeude: {
    ab1949: {
      isAb1949: "true",
    },
    baujahr: {
      baujahr: "1970",
    },
    kernsaniert: {
      isKernsaniert: "true",
    },
    kernsanierungsjahr: {
      kernsanierungsjahr: "2002",
    },
    wohnflaeche: {
      wohnflaeche: "24",
    },
    weitereWohnraeume: {
      hasWeitereWohnraeume: "true",
    },
    weitereWohnraeumeFlaeche: {
      flaeche: "42",
    },
    garagen: {
      hasGaragen: "true",
    },
    garagenAnzahl: {
      anzahlGaragen: "1",
    },
  },
  eigentuemer: {
    anzahl: {
      anzahl: "2",
    },
    verheiratet: {
      areVerheiratet: "",
    },
    person1: {
      angaben: {
        anrede: "Frau",
        titel: "Dr.",
        name: "Drew",
        vorname: "Nancy",
        geburtsdatum: "10112000",
      },
      adresse: {
        strasse: "Baker St.",
        hausnummer: "221b",
        postfach: "",
        plz: "12345",
        ort: "London",
      },
      telefonnummer: {
        telefonnummer: "555-2368",
      },
      steuerId: {
        steuerId: "04452397687",
      },
      gesetzlicherVertreter: {
        hasVertreter: "true",
      },
      vertreter: {
        name: {
          anrede: "Herr",
          titel: "Prof Dr",
          name: "Mustermann",
          vorname: "Max",
        },
        adresse: {
          strasse: "Vertreterstr.",
          hausnummer: "42",
          postfach: "",
          plz: "54321",
          ort: "Manchester",
        },
        telefonnummer: {
          telefonnummer: "123-321",
        },
      },
      anteil: {
        zaehler: "1",
        nenner: "2",
      },
    },
    person2: {
      angaben: {
        anrede: "Herr",
        titel: "Buccaneer",
        name: "Threepwood",
        vorname: "Guybrush",
        geburtsdatum: "01101990",
      },
      adresse: {
        strasse: "Privet Drive",
        hausnummer: "4",
        postfach: "",
        plz: "01234",
        ort: "Little Whinging",
      },
      telefonnummer: {
        telefonnummer: "089-32168",
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
  },
  grundstueck: {
    bebaut: "",
  },
};

export const submitBtnSelector = "#nextButton";

describe("Happy Path", () => {
  it.only("Enter data for two eigentuemer", () => {
    cy.visit("/formular/grundstueck/typ");
    cy.get(`label[for=typ-${inputData.grundsteuck.typ.typ}]`).click();
    cy.get(submitBtnSelector).click();

    cy.visit("/formular/gebaeude/ab1949");
    cy.get(`label[for=isAb1949-${inputData.gebaeude.ab1949.isAb1949}]`).click();
    cy.get(submitBtnSelector).click();
    cy.get("#baujahr").clear().type(inputData.gebaeude.baujahr.baujahr);
    cy.get(submitBtnSelector).click();
    cy.get(
      `label[for=isKernsaniert-${inputData.gebaeude.kernsaniert.isKernsaniert}]`
    ).click();
    cy.get(submitBtnSelector).click();
    cy.get("#kernsanierungsjahr")
      .clear()
      .type(inputData.gebaeude.kernsanierungsjahr.kernsanierungsjahr);
    cy.get(submitBtnSelector).click();
    cy.get("#wohnflaeche")
      .clear()
      .type(inputData.gebaeude.wohnflaeche.wohnflaeche);
    cy.get(submitBtnSelector).click();
    cy.get(
      `label[for=hasWeitereWohnraeume-${inputData.gebaeude.weitereWohnraeume.hasWeitereWohnraeume}]`
    ).click();
    cy.get(submitBtnSelector).click();
    cy.get("#flaeche")
      .clear()
      .type(inputData.gebaeude.weitereWohnraeumeFlaeche.flaeche);
    cy.get(submitBtnSelector).click();
    cy.get(
      `label[for=hasGaragen-${inputData.gebaeude.garagen.hasGaragen}]`
    ).click();
    cy.get(submitBtnSelector).click();
    cy.get("#anzahlGaragen")
      .clear()
      .type(inputData.gebaeude.garagenAnzahl.anzahlGaragen);
    cy.get(submitBtnSelector).click();

    cy.url().should("include", "/formular/eigentuemer");
    cy.get("#anzahl").select(inputData.eigentuemer.anzahl.anzahl);
    cy.get(submitBtnSelector).click();
    cy.get("label[for=areVerheiratet-true]").click();
    cy.get(submitBtnSelector).click();
    // PERSON 1
    cy.get("#anrede")
      .clear()
      .type(inputData.eigentuemer.person1.angaben.anrede);
    cy.get("#titel").clear().type(inputData.eigentuemer.person1.angaben.titel);
    cy.get("#name").clear().type(inputData.eigentuemer.person1.angaben.name);
    cy.get("#vorname")
      .clear()
      .type(inputData.eigentuemer.person1.angaben.vorname);
    cy.get("#geburtsdatum")
      .clear()
      .type(inputData.eigentuemer.person1.angaben.geburtsdatum);
    cy.get(submitBtnSelector).click();
    cy.get("#strasse")
      .clear()
      .type(inputData.eigentuemer.person1.adresse.strasse);
    cy.get("#hausnummer")
      .clear()
      .type(inputData.eigentuemer.person1.adresse.hausnummer);
    cy.get("#plz").clear().type(inputData.eigentuemer.person1.adresse.plz);
    cy.get("#ort").clear().type(inputData.eigentuemer.person1.adresse.ort);
    cy.get(submitBtnSelector).click();
    cy.get("#telefonnummer")
      .clear()
      .type(inputData.eigentuemer.person1.telefonnummer.telefonnummer);
    cy.get(submitBtnSelector).click();
    cy.get("#steuerId")
      .clear()
      .type(inputData.eigentuemer.person1.steuerId.steuerId);
    cy.get(submitBtnSelector).click();
    cy.get("#hasVertreter-true").click();
    cy.get(submitBtnSelector).click();
    cy.get("#anrede")
      .clear()
      .type(inputData.eigentuemer.person1.vertreter.name.anrede);
    cy.get("#titel")
      .clear()
      .type(inputData.eigentuemer.person1.vertreter.name.titel);
    cy.get("#name")
      .clear()
      .type(inputData.eigentuemer.person1.vertreter.name.name);
    cy.get("#vorname")
      .clear()
      .type(inputData.eigentuemer.person1.vertreter.name.vorname);
    cy.get(submitBtnSelector).click();
    cy.get("#strasse")
      .clear()
      .type(inputData.eigentuemer.person1.vertreter.adresse.strasse);
    cy.get("#hausnummer")
      .clear()
      .type(inputData.eigentuemer.person1.vertreter.adresse.hausnummer);
    cy.get("#plz")
      .clear()
      .type(inputData.eigentuemer.person1.vertreter.adresse.plz);
    cy.get("#ort")
      .clear()
      .type(inputData.eigentuemer.person1.vertreter.adresse.ort);
    cy.get(submitBtnSelector).click();
    cy.get("#telefonnummer")
      .clear()
      .type(
        inputData.eigentuemer.person1.vertreter.telefonnummer.telefonnummer
      );
    cy.get(submitBtnSelector).click();
    cy.get("#zaehler")
      .clear()
      .type(inputData.eigentuemer.person1.anteil.zaehler);
    cy.get("#nenner").clear().type(inputData.eigentuemer.person1.anteil.nenner);
    cy.get(submitBtnSelector).click();

    // PERSON 2
    cy.url().should("include", "/formular/eigentuemer/person/2/");
    cy.get("#anrede")
      .clear()
      .type(inputData.eigentuemer.person2.angaben.anrede);
    cy.get("#titel").clear().type(inputData.eigentuemer.person2.angaben.titel);
    cy.get("#name").clear().type(inputData.eigentuemer.person2.angaben.name);
    cy.get("#vorname")
      .clear()
      .type(inputData.eigentuemer.person2.angaben.vorname);
    cy.get("#geburtsdatum")
      .clear()
      .type(inputData.eigentuemer.person2.angaben.geburtsdatum);
    cy.get(submitBtnSelector).click();
    cy.get("#strasse")
      .clear()
      .type(inputData.eigentuemer.person2.adresse.strasse);
    cy.get("#hausnummer")
      .clear()
      .type(inputData.eigentuemer.person2.adresse.hausnummer);
    cy.get("#plz").clear().type(inputData.eigentuemer.person2.adresse.plz);
    cy.get("#ort").clear().type(inputData.eigentuemer.person2.adresse.ort);
    cy.get(submitBtnSelector).click();
    cy.get("#telefonnummer")
      .clear()
      .type(inputData.eigentuemer.person2.telefonnummer.telefonnummer);
    cy.get(submitBtnSelector).click();
    cy.get("#steuerId")
      .clear()
      .type(inputData.eigentuemer.person2.steuerId.steuerId);
    cy.get(submitBtnSelector).click();
    cy.get("#hasVertreter-false").click();
    cy.get(submitBtnSelector).click();
    cy.get("#zaehler")
      .clear()
      .type(inputData.eigentuemer.person2.anteil.zaehler);
    cy.get("#nenner").clear().type(inputData.eigentuemer.person2.anteil.nenner);
    cy.get(submitBtnSelector).click();

    // ZUSAMMENFASSUNG
    cy.url().should("include", "/formular/zusammenfassung");
    cy.contains("Bezugsfertig ab 1949: Ja");
    cy.contains(`Baujahr: ${inputData.gebaeude.baujahr.baujahr}`);
    cy.contains("Kernsaniert: Ja");
    cy.contains(
      `Jahr der Kernsanierung: ${inputData.gebaeude.kernsanierungsjahr.kernsanierungsjahr}`
    );
    cy.contains(`Wohnfläche: ${inputData.gebaeude.wohnflaeche.wohnflaeche} m2`);
    cy.contains(`Weitere Wohnräume: Ja`);
    cy.contains(
      `Gesamtfläche der weiteren Wohnräume: ${inputData.gebaeude.weitereWohnraeumeFlaeche.flaeche} m2`
    );
    cy.contains(
      `Anzahl Garagen: ${inputData.gebaeude.garagenAnzahl.anzahlGaragen}`
    );

    cy.contains("Anzahl: " + inputData.eigentuemer.anzahl.anzahl);
    cy.contains("Verheiratet: Ja");
    cy.get("#person-0").contains(
      "Anrede: " + inputData.eigentuemer.person1.angaben.anrede
    );
    cy.get("#person-0").contains(
      "Titel: " + inputData.eigentuemer.person1.angaben.titel
    );
    cy.get("#person-0").contains(
      "Name: " + inputData.eigentuemer.person1.angaben.name
    );
    cy.get("#person-0").contains(
      "Vorname: " + inputData.eigentuemer.person1.angaben.vorname
    );
    cy.get("#person-0").contains(
      "Geburtsdatum: " + inputData.eigentuemer.person1.angaben.geburtsdatum
    );
    cy.get("#person-0").contains(
      "Straße: " + inputData.eigentuemer.person1.adresse.strasse
    );
    cy.get("#person-0").contains(
      "Hausnummer: " + inputData.eigentuemer.person1.adresse.hausnummer
    );
    cy.get("#person-0").contains(
      "PLZ: " + inputData.eigentuemer.person1.adresse.plz
    );
    cy.get("#person-0").contains(
      "Ort: " + inputData.eigentuemer.person1.adresse.ort
    );
    cy.get("#person-0").contains(
      "Telefonnummer: " +
        inputData.eigentuemer.person1.telefonnummer.telefonnummer
    );
    cy.get("#person-0").contains(
      "Steuer-ID: " + inputData.eigentuemer.person1.steuerId.steuerId
    );
    cy.get("#person-0").contains("Gesetzlicher Vertreter: Ja");
    cy.get("#person-0-vertreter").contains(
      "Anrede: " + inputData.eigentuemer.person1.vertreter.name.anrede
    );
    cy.get("#person-0-vertreter").contains(
      "Titel: " + inputData.eigentuemer.person1.vertreter.name.titel
    );
    cy.get("#person-0-vertreter").contains(
      "Name: " + inputData.eigentuemer.person1.vertreter.name.name
    );
    cy.get("#person-0-vertreter").contains(
      "Vorname: " + inputData.eigentuemer.person1.vertreter.name.vorname
    );
    cy.get("#person-0-vertreter").contains(
      "Straße: " + inputData.eigentuemer.person1.vertreter.adresse.strasse
    );
    cy.get("#person-0-vertreter").contains(
      "Hausnummer: " +
        inputData.eigentuemer.person1.vertreter.adresse.hausnummer
    );
    cy.get("#person-0-vertreter").contains(
      "PLZ: " + inputData.eigentuemer.person1.vertreter.adresse.plz
    );
    cy.get("#person-0-vertreter").contains(
      "Ort: " + inputData.eigentuemer.person1.vertreter.adresse.ort
    );
    cy.get("#person-0-vertreter").contains(
      "Telefonnummer: " +
        inputData.eigentuemer.person1.vertreter.telefonnummer.telefonnummer
    );
    cy.get("#person-0").contains(
      "Anteil Zähler: " + inputData.eigentuemer.person1.anteil.zaehler
    );
    cy.get("#person-0").contains(
      "Anteil Nenner: " + inputData.eigentuemer.person1.anteil.nenner
    );

    cy.get("#person-1").contains(
      "Anrede: " + inputData.eigentuemer.person2.angaben.anrede
    );
    cy.get("#person-1").contains(
      "Titel: " + inputData.eigentuemer.person2.angaben.titel
    );
    cy.get("#person-1").contains(
      "Name: " + inputData.eigentuemer.person2.angaben.name
    );
    cy.get("#person-1").contains(
      "Vorname: " + inputData.eigentuemer.person2.angaben.vorname
    );
    cy.get("#person-1").contains(
      "Geburtsdatum: " + inputData.eigentuemer.person2.angaben.geburtsdatum
    );
    cy.get("#person-1").contains(
      "Straße: " + inputData.eigentuemer.person2.adresse.strasse
    );
    cy.get("#person-1").contains(
      "Hausnummer: " + inputData.eigentuemer.person2.adresse.hausnummer
    );
    cy.get("#person-1").contains(
      "PLZ: " + inputData.eigentuemer.person2.adresse.plz
    );
    cy.get("#person-1").contains(
      "Ort: " + inputData.eigentuemer.person2.adresse.ort
    );
    cy.get("#person-1").contains(
      "Telefonnummer: " +
        inputData.eigentuemer.person2.telefonnummer.telefonnummer
    );
    cy.get("#person-1").contains(
      "Steuer-ID: " + inputData.eigentuemer.person2.steuerId.steuerId
    );
    cy.get("#person-1").contains("Gesetzlicher Vertreter: Nein");
    cy.get("#person-1").contains(
      "Anteil Zähler: " + inputData.eigentuemer.person2.anteil.zaehler
    );
    cy.get("#person-1").contains(
      "Anteil Nenner: " + inputData.eigentuemer.person2.anteil.nenner
    );
  });
});
