import { render, screen, within } from "@testing-library/react";
import Bodenrichtwert, {
  BodenrichtwertHelp,
} from "~/components/steps/grundstueck/bodenrichtwert";
import { grundstueckBodenrichtwert } from "~/domain/steps/grundstueck/bodenrichtwert";
import { getI18nObject } from "test/factories/i18n";
import { I18nObject } from "~/routes/formular/_step";
import { grundModelFactory, flurstueckFactory } from "test/factories";
import { GrundModel } from "~/domain/steps";

describe("Bodenrichtwert page component", () => {
  const defaultInput = {
    stepDefinition: grundstueckBodenrichtwert,
    formData: {},
    allData: {},
    i18n: {} as I18nObject,
    backUrl: "back/url",
    currentStateWithoutId: "current/state",
    errors: {},
  };

  beforeEach(async () => {
    defaultInput.i18n = await getI18nObject("grundstueck.bodenrichtwert");
  });

  it("should render input fields", () => {
    render(<Bodenrichtwert {...defaultInput} />);
    expect(screen.getByLabelText("Bodenrichtwert in €")).toBeInTheDocument();
    expect(
      screen.getByLabelText("Mein Grundstück hat zwei Bodenrichtwerte")
    ).toBeInTheDocument();
  });

  describe("With no data", () => {
    it("should not render address", () => {
      render(<Bodenrichtwert {...defaultInput} />);
      expect(
        screen.queryByTestId("grundstueck-adresse")
      ).not.toBeInTheDocument();
    });

    it("should not render flurstuecke", () => {
      render(<Bodenrichtwert {...defaultInput} />);
      expect(
        screen.queryByTestId("grundstueck-flurstuecke")
      ).not.toBeInTheDocument();
    });
  });

  describe("With Adresse set", () => {
    const adresseData = {
      strasse: "Diagon Alley",
      hausnummer: "7b",
      ort: "London",
      plz: "01234",
      zusatzangaben: "Touch Brick",
    };

    beforeEach(async () => {
      defaultInput.allData = grundModelFactory
        .grundstueckAdresse(adresseData)
        .build();
    });

    it("should render address", () => {
      render(<Bodenrichtwert {...defaultInput} />);
      expect(screen.queryByTestId("grundstueck-adresse")).toBeInTheDocument();
    });

    it("should render address data", () => {
      render(<Bodenrichtwert {...defaultInput} />);
      const adresseArea = screen.getByTestId("grundstueck-adresse");
      expect(
        within(adresseArea).getByText(adresseData.strasse, { exact: false })
      ).toBeInTheDocument();
      expect(
        within(adresseArea).getByText(adresseData.hausnummer, { exact: false })
      ).toBeInTheDocument();
      expect(
        within(adresseArea).getByText(adresseData.ort, { exact: false })
      ).toBeInTheDocument();
      expect(
        within(adresseArea).getByText(adresseData.plz, { exact: false })
      ).toBeInTheDocument();
      expect(
        within(adresseArea).getByText(adresseData.zusatzangaben, {
          exact: false,
        })
      ).toBeInTheDocument();
    });
  });

  describe("With Flurstuecke set", () => {
    beforeEach(async () => {
      defaultInput.allData = grundModelFactory
        .grundstueckAnzahl({ anzahl: "2" })
        .grundstueckFlurstueck({ count: 2 })
        .build();
    });

    it("should render flurstuecke area", () => {
      render(<Bodenrichtwert {...defaultInput} />);
      expect(
        screen.queryByTestId("grundstueck-flurstuecke")
      ).toBeInTheDocument();
    });

    it("should render flurstuecke data", () => {
      render(<Bodenrichtwert {...defaultInput} />);
      const flurstueckeArea = screen.getByTestId("grundstueck-flurstuecke");
      // Both flurstuecke have the same data -> expect everything twice
      const flurstueckData = (defaultInput.allData as GrundModel).grundstueck
        ?.flurstueck?.[0].angaben;
      const flurstueckFlurData = (defaultInput.allData as GrundModel)
        .grundstueck?.flurstueck?.[0].flur;
      if (flurstueckData) {
        expect(
          within(flurstueckeArea).getAllByText(
            `Grundbuchblatt: ${flurstueckData.grundbuchblattnummer}`,
            { exact: false }
          )
        ).toHaveLength(2);
        expect(
          within(flurstueckeArea).getAllByText(
            `Gemarkung: ${flurstueckData.gemarkung}`,
            {
              exact: false,
            }
          )
        ).toHaveLength(2);
        expect(
          within(flurstueckeArea).getAllByText(
            `Flur: ${flurstueckFlurData?.flur}`,
            {
              exact: false,
            }
          )
        ).toHaveLength(2);
        expect(
          within(flurstueckeArea).getAllByText(
            `Flurstück Zähler: ${flurstueckFlurData?.flurstueckZaehler}`,
            {
              exact: false,
            }
          )
        ).toHaveLength(2);
        expect(
          within(flurstueckeArea).getAllByText(
            `Flurstück Nenner: ${flurstueckFlurData?.flurstueckNenner}`,
            {
              exact: false,
            }
          )
        ).toHaveLength(2);
      } else {
        fail("Flurstueck data should be set");
      }
    });
  });

  describe("With Flurstuecke partly set", () => {
    beforeEach(async () => {
      const flurstueckList = [
        flurstueckFactory.angaben().flur().build(),
        flurstueckFactory.build(),
      ];
      defaultInput.allData = grundModelFactory
        .grundstueckAnzahl({ anzahl: "2" })
        .grundstueckFlurstueck({ list: flurstueckList })
        .build();
    });

    it("should render only set flurstuecke data", () => {
      render(<Bodenrichtwert {...defaultInput} />);
      const flurstueckeArea = screen.getByTestId("grundstueck-flurstuecke");
      const flurstueckData = (defaultInput.allData as GrundModel).grundstueck
        ?.flurstueck?.[0].angaben;
      const flurstueckFlurData = (defaultInput.allData as GrundModel)
        .grundstueck?.flurstueck?.[0].flur;

      if (flurstueckData && flurstueckFlurData) {
        expect(
          within(flurstueckeArea).getAllByText(
            `Grundbuchblatt: ${flurstueckData.grundbuchblattnummer}`,
            { exact: false }
          )
        ).toHaveLength(1);
        expect(
          within(flurstueckeArea).getAllByText(
            `Gemarkung: ${flurstueckData.gemarkung}`,
            {
              exact: false,
            }
          )
        ).toHaveLength(1);
        expect(
          within(flurstueckeArea).queryAllByText(`Flur:`, {
            exact: false,
          })
        ).toHaveLength(1);
        expect(
          within(flurstueckeArea).getAllByText(
            `Flurstück Zähler: ${flurstueckFlurData?.flurstueckZaehler}`,
            {
              exact: false,
            }
          )
        ).toHaveLength(1);
        expect(
          within(flurstueckeArea).queryAllByText(`Flurstück Nenner:`, {
            exact: false,
          })
        ).toHaveLength(1);
      } else {
        fail("Flurstueck data should be set");
      }
    });
  });

  describe("With Flurstuecke > Anzahl", () => {
    beforeEach(async () => {
      defaultInput.allData = grundModelFactory
        .grundstueckAnzahl({ anzahl: "2" })
        .grundstueckFlurstueck({ count: 4 })
        .build();
    });

    it("should render only 2 Flurstuecke", () => {
      render(<Bodenrichtwert {...defaultInput} />);
      const flurstueckeArea = screen.getByTestId("grundstueck-flurstuecke");
      expect(flurstueckeArea.children.length).toEqual(2);
    });
  });
});

describe("Bodenrichtwert help component", () => {
  describe("show correct help for bundesland", () => {
    const defaultInput = {
      stepDefinition: grundstueckBodenrichtwert,
      formData: {},
      allData: {},
      i18n: {} as I18nObject,
      backUrl: "back/url",
      currentStateWithoutId: "current/state",
      errors: {},
    };

    it("Should show default help if no data set", () => {
      render(<BodenrichtwertHelp {...defaultInput} />);
      expect(
        screen.queryByText(
          "wählen Sie bitte das Bundesland unter Grundstücksadresse",
          { exact: false }
        )
      ).toBeInTheDocument();
    });

    const cases = [
      { bundesland: "BE", expectedText: "Berlin" },
      { bundesland: "BB", expectedText: "Brandenburg" },
      { bundesland: "HB", expectedText: "Bremen" },
      { bundesland: "MV", expectedText: "Mecklenburg-Vorpommern" },
      { bundesland: "NW", expectedText: "Nordrhein-Westfahlen" },
      { bundesland: "RP", expectedText: "Rheinland-Pfalz" },
      { bundesland: "SH", expectedText: "Schleswig-Holstein" },
      { bundesland: "SL", expectedText: "Saarland" },
      { bundesland: "SN", expectedText: "Sachsen" },
      { bundesland: "ST", expectedText: "Sachsen-Anhalt" },
      { bundesland: "TH", expectedText: "Thüringen" },
    ];

    test.each(cases)(
      "Should display $expectedText if bundesland is '$bundesland'",
      ({ bundesland, expectedText }) => {
        defaultInput.allData = grundModelFactory
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          .grundstueckAdresse({ bundesland: bundesland })
          .build();
        render(<BodenrichtwertHelp {...defaultInput} />);
        expect(
          screen.queryByText("Bodenrichtwert " + expectedText, { exact: false })
        ).toBeInTheDocument();
      }
    );
  });
});

export {};
