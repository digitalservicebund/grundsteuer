import { render, screen } from "@testing-library/react";
import { getI18nObject } from "~/factories/i18n";
import { grundModelFactory } from "~/factories";
import { I18nObject } from "~/i18n/getStepI18n";
import BodenrichtwertAnzahl from "~/components/steps/grundstueck/BodenrichtwertAnzahl";
import { grundstueckBodenrichtwertAnzahl } from "~/domain/steps/grundstueck/bodenrichtwert/anzahl";

describe("BodenrichtwertAnzahl component should render correct label for each bundesland", () => {
  const defaultInput = {
    stepDefinition: grundstueckBodenrichtwertAnzahl,
    formData: {},
    allData: {},
    i18n: {} as I18nObject,
    backUrl: "back/url",
    currentStateWithoutId: "current/state",
    errors: {},
  };

  const cases = [
    { bundesland: "default", expectedText: "nur ein" },
    { bundesland: "BB", expectedText: "nur ein" },
    {
      bundesland: "BE",
      expectedText:
        "Sieht ihr Grundstück auf der Karte so aus wie im unteren Bildbeispiel",
    },
    { bundesland: "HB", expectedText: "nur ein" },
    { bundesland: "MV", expectedText: "nur ein" },
    { bundesland: "NW", expectedText: "nur ein" },
    { bundesland: "RP", expectedText: "nur ein" },
    { bundesland: "SH", expectedText: "nur ein" },
    { bundesland: "SL", expectedText: "nur ein" },
    { bundesland: "SN", expectedText: "nur ein" },
    { bundesland: "ST", expectedText: "nur ein" },
    { bundesland: "TH", expectedText: "nur ein" },
  ];

  test.each(cases)(
    "Should display $expectedText if bundesland is '$bundesland'",
    async ({ bundesland, expectedText }) => {
      defaultInput.i18n = await getI18nObject(
        "grundstueck.bodenrichtwertAnzahl." + bundesland.toLowerCase()
      );
      defaultInput.allData = grundModelFactory
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        .grundstueckAdresse({ bundesland: bundesland })
        .build();
      render(<BodenrichtwertAnzahl {...defaultInput} />);
      expect(
        screen.queryByText(expectedText, { exact: false })
      ).toBeInTheDocument();
    }
  );
});

export {};
