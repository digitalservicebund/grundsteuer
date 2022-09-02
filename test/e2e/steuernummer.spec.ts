/// <reference types="../../cypress/support" />
// @ts-checkdescribe("Boris pages", () => {
describe("/grundstueck/steuernummer", () => {
  beforeEach(() => {
    cy.login();
  });
  const data = [
    {
      key: "BE",
      title: "Geben Sie die Steuernummer Ihres Grundstücks ein",
      description:
        "Es handelt sich nicht um Ihre Steuernummer der Einkommenssteuer, Ihre Steuer-Identifikationsnummer oder das Kassenzeichen. Die Steuernummer Ihres Grundstücks finden Sie beispielsweise auf dem Grundsteuerbescheid, dem Kontoauszug (insbesondere bei Lastschrift) oder dem Einheitswertbescheid.",
      hint: "Die Steuernummer ihres Grundstücks besteht aus 10 Ziffern. Die ersten beiden Ziffern können immer nur: 13, 14, 16, 17, 18, 19, 21, 23, 24, 25, 31 ,32, 33, 34, 35 oder 36 sein. Die Ziffern 3 bis 5 müssen größer als 700 sein. Zum Beispiel: 13/700/XXXX",
      invalidValue: "15/700/01234",
      error:
        "Es kann sich bei Ihrer Eingabe nicht um die Steuernummer Ihres Grundstücks handeln. Die Steuernummer Ihres Grundstücks besteht aus 10 Ziffern. Ihre Steuernummer muss im folgenden Format eingegeben werden: XX/XXX/XXXXX. Die ersten beiden Ziffern können immer nur: 13, 14, 16, 17, 18, 19, 21, 23, 24, 25, 31 ,32, 33, 34, 35 oder 36 sein. Die Ziffern 3 bis 5 müssen größer als 700 sein.",
    },
    {
      key: "HB",
      title: "Geben Sie die Steuernummer Ihres Grundstücks ein",
      description:
        "Es handelt sich nicht um Ihre Steuernummer der Einkommenssteuer, Ihre Steuer-Identifikationsnummer oder das Kassenzeichen. Die Steuernummer Ihres Grundstücks finden Sie beispielsweise auf dem Informationsschreiben des Finanzamtes Bremerhaven. Zudem finden Sie Ihre Steuernummer auf Ihrem Einheitswertbescheid und für ein Grundstück in der Stadtgemeinde Bremen auch auf Ihrem letzten Grundsteuerbescheid.",
      hint: "Ihre Steuernummer des Grundstücks besteht aus 10 Ziffern und beginnt mit 57 oder 77.",
      invalidValue: "56/700/01234",
      error:
        "Es kann sich bei Ihrer Eingabe nicht um die Steuernummer Ihres Grundstücks handeln. Die Steuernummer für Ihr Grundstück besteht aus 10 Ziffern und beginnt mit 57 oder 77.",
    },
    {
      key: "NW",
      title: "Geben Sie das Aktenzeichen Ihres Grundstücks ein",
      description:
        "Es handelt sich nicht um das Kassenzeichen. Das Aktenzeichen Ihres Grundstücks finden Sie beispielsweise auf dem Informationsschreiben Ihrer Landesfinanzverwaltung zur Grundsteuerreform oder auf dem Grundsteuerbescheid.",
      hint: "Ihr Aktenzeichen besteht aus 13 Ziffern. Die siebte Ziffer ist immer eine 3.",
      invalidValue: "123/456-4-78901.2",
      error:
        "Es kann sich bei Ihrer Eingabe nicht um das Aktenzeichen Ihres Grundstücks handeln. Ihr Aktenzeichen besteht aus 13 Ziffern. Die siebte Ziffer ist immer eine 3.",
    },
    {
      key: "SH",
      title: "Geben Sie die Steuernummer Ihres Grundstücks ein",
      description:
        "Es handelt sich nicht um Ihre Steuernummer der Einkommenssteuer, Ihre Steuer-Identifikationsnummer oder das Kassenzeichen. Die Steuernummer Ihres Grundstücks finden Sie beispielsweise auf dem Informationsschreiben des Bundeslandes Schleswig-Holstein zur Grundsteuerreform oder auf dem Grundsteuerbescheid.",
      hint: "Ihre Steuernummer besteht immer aus 10 Ziffern und beginnt mit einer 7, 8 oder 9.",
      invalidValue: "60 123 45678",
      error:
        "Es kann sich bei Ihrer Eingabe nicht um die Steuernummer Ihres Grundstücks handeln. Die Steuernummer für Ihr Grundstück besteht aus 10 Ziffern und beginnt mit einer 7, 8 oder 9.",
    },
  ];
  data.forEach(({ key, title, description, hint, invalidValue, error }) => {
    it(`should render correct text for speical bundesland: ${key}`, () => {
      cy.bundesland(key);
      cy.wait(500);

      cy.visit("/formular/grundstueck/steuernummer");
      cy.url().should("contain", "steuernummer");
      cy.contains("h1", title);
      cy.contains(description);
      cy.get("[data-testid=hint").contains(hint);
    });

    it(`should display correct validation error message for bundesland: ${key}`, () => {
      cy.bundesland(key);
      cy.wait(500);

      cy.get("[name=steuernummer]").type(invalidValue);
      cy.get("#nextButton").click();
      cy.get("[data-testid=field-error").contains(error);
    });
  });

  ["BB", "MV", "RP", "SL", "SN", "ST", "TH"].forEach((key) => {
    it(`should render correct text for default bundesland: ${key}`, () => {
      cy.bundesland(key);
      cy.wait(500);

      cy.visit("/formular/grundstueck/steuernummer");
      cy.url().should("contain", "steuernummer");
      cy.contains("h1", "Geben Sie das Aktenzeichen Ihres Grundstücks ein");
      cy.contains(
        "Es handelt sich nicht um das Kassenzeichen. Das Aktenzeichen Ihres Grundstücks finden Sie beispielsweise auf dem Informationsschreiben Ihrer Landesfinanzverwaltung zur Grundsteuerreform oder auf dem Grundsteuerbescheid."
      );
      cy.get("[data-testid=hint").contains(
        "Ihr Aktenzeichen besteht aus 17 Ziffern."
      );
    });

    it(`should display correct validation error message for bundesland: ${key}`, () => {
      cy.bundesland(key);
      cy.wait(500);

      cy.get("[name=steuernummer]").type("123/456/7890/987/65/3");
      cy.get("#nextButton").click();
      cy.get("[data-testid=field-error]").contains(
        "Es kann sich bei Ihrer Eingabe nicht um das Aktenzeichen Ihres Grundstücks handeln. Ihr Aktenzeichen besteht aus 17 Ziffern."
      );
    });
  });
});

export {};
