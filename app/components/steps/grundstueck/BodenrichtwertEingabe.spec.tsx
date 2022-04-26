import { render, screen } from "@testing-library/react";
import { getI18nObject } from "test/factories/i18n";
import { grundModelFactory } from "test/factories";
import { I18nObject } from "~/i18n/getStepI18n";
import BodenrichtwertEingabe from "~/components/steps/grundstueck/BodenrichtwertEingabe";
import { grundstueckBodenrichtwert } from "~/domain/steps/grundstueck/bodenrichtwert/bodenrichtwert";

describe("BodenrichtwertEingabe component", () => {
  describe("should render for each bundesland", () => {
    const defaultInput = {
      stepDefinition: grundstueckBodenrichtwert,
      formData: {},
      allData: {},
      i18n: {} as I18nObject,
      backUrl: "back/url",
      currentStateWithoutId: "current/state",
      errors: {},
    };

    const cases = [
      { bundesland: "default", expectedText: "Bodenrichtwert in €" },
      { bundesland: "BB", expectedText: "Bodenrichtwert in €" },
      { bundesland: "BE", expectedText: "die erste unterstrichene rote Zahl" },
      { bundesland: "HB", expectedText: "Bodenrichtwert in €" },
      { bundesland: "MV", expectedText: "Bodenrichtwert in €" },
      { bundesland: "NW", expectedText: "Bodenrichtwert in €" },
      { bundesland: "RP", expectedText: "Bodenrichtwert in €" },
      { bundesland: "SH", expectedText: "Bodenrichtwert in €" },
      { bundesland: "SL", expectedText: "Bodenrichtwert in €" },
      { bundesland: "SN", expectedText: "Bodenrichtwert in €" },
      { bundesland: "ST", expectedText: "Bodenrichtwert in €" },
      { bundesland: "TH", expectedText: "Bodenrichtwert in €" },
    ];

    test.each(cases)(
      "Should display $expectedText if bundesland is '$bundesland'",
      async ({ bundesland, expectedText }) => {
        defaultInput.i18n = await getI18nObject(
          "grundstueck.bodenrichtwertEingabe." + bundesland.toLowerCase()
        );
        defaultInput.allData = grundModelFactory
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          .grundstueckAdresse({ bundesland: bundesland })
          .build();
        render(<BodenrichtwertEingabe {...defaultInput} />);
        expect(
          screen.queryByText(expectedText, { exact: false })
        ).toBeInTheDocument();
      }
    );
  });
});

export {};
