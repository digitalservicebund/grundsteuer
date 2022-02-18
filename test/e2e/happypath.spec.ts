/// <reference types="cypress" />

const inputData = {
  eigentuemer: {
    anzahl: {
      anzahl: "2",
    },
    verheiratet: {
      areVerheiratet: "",
    },
    person1: {
      adresse: {
        strasse: "Baker St.",
        hausnummer: "221b",
        zusatzangaben: "",
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
    },
    person2: {
      adresse: {
        strasse: "Privet Drive",
        hausnummer: "4",
        zusatzangaben: "Surrey",
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
    },
  },
  grundstueck: {
    bebaut: "",
  },
};

const submitBtnSelector = "#nextButton";

it("Enter data for two eigentuemer", () => {
  cy.visit("/formular/eigentuemer/anzahl");
  cy.get("#anzahl").clear().type(inputData.eigentuemer.anzahl.anzahl);
  cy.get(submitBtnSelector).click();
  cy.get("label[for=areVerheiratet-true]").click();
  cy.get(submitBtnSelector).click();
  // PERSON 1
  // TODO persoenlicheAngaben
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
  // TODO gesetzlicher Vertreter Daten
  cy.get(submitBtnSelector).click();

  // PERSON 2
  cy.url().should("include", "/formular/eigentuemer/person/2/");
  // TODO persoenlicheAngaben
  cy.get(submitBtnSelector).click();
  cy.get("#strasse")
    .clear()
    .type(inputData.eigentuemer.person2.adresse.strasse);
  cy.get("#hausnummer")
    .clear()
    .type(inputData.eigentuemer.person2.adresse.hausnummer);
  cy.get("#zusatzangaben")
    .clear()
    .type(inputData.eigentuemer.person2.adresse.zusatzangaben);
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

  // GRUNDSTUECK
  cy.url().should("include", "/formular/grundstueck");

  // ZUSAMMENFASSUNG
  cy.visit("/formular/zusammenfassung");
  cy.contains("Anzahl: " + inputData.eigentuemer.anzahl.anzahl);
  cy.contains("Verheiratet: Ja");
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
  // TODO check telefonnummer + SteuerID
  // cy.get("#person-0").contains("Telefonnummer: " + inputData.eigentuemer.person1.telefonnummer.telefonnummer)
  // cy.get("#person-0").contains("Steuer-ID: " + inputData.eigentuemer.person1.steuerId.steuerId)
  cy.get("#person-0").contains("Gesetzlicher Vertreter: Ja");

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
  // TODO check telefonnummer + SteuerID
  // cy.get("#person-1").contains("Telefonnummer: " + inputData.eigentuemer.person2.telefonnummer.telefonnummer)
  // cy.get("#person-1").contains("Steuer-ID: " + inputData.eigentuemer.person2.steuerId.steuerId)
  cy.get("#person-1").contains("Gesetzlicher Vertreter: Nein");
});
