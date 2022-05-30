import { render, screen } from "@testing-library/react";
import BodenrichtwertInfo from "~/components/steps/grundstueck/BodenrichtwertInfo";
import { getI18nObject } from "test/factories/i18n";
import { grundModelFactory } from "test/factories";
import { I18nObject } from "~/i18n/getStepI18n";

describe("BodenrichtwertInfo component should display link label for each bundesland", () => {
  const defaultInput = {
    stepDefinition: { fields: {} },
    formData: {},
    allData: {},
    i18n: {} as I18nObject,
    backUrl: "back/url",
    currentStateWithoutId: "current/state",
    errors: {},
  };

  const cases = [
    { bundesland: "BE", expectedText: "Berlin" },
    { bundesland: "BB", expectedText: "Brandenburg" },
    { bundesland: "HB", expectedText: "Bremen" },
    { bundesland: "MV", expectedText: "Mecklenburg-Vorpommern" },
    { bundesland: "NW", expectedText: "Nordrhein-Westfalen" },
    { bundesland: "RP", expectedText: "Rheinland-Pfalz" },
    { bundesland: "SH", expectedText: "Schleswig-Holstein" },
    { bundesland: "SL", expectedText: "Saarland" },
    { bundesland: "SN", expectedText: "Sachsen" },
    { bundesland: "ST", expectedText: "Sachsen-Anhalt" },
    { bundesland: "TH", expectedText: "Thüringen" },
  ];

  test.each(cases)(
    "Should display $expectedText if bundesland is '$bundesland'",
    async ({ bundesland, expectedText }) => {
      defaultInput.i18n = await getI18nObject(
        "grundstueck.bodenrichtwertInfo." + bundesland.toLowerCase()
      );
      defaultInput.allData = grundModelFactory
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        .grundstueckAdresse({ bundesland: bundesland })
        .build();
      render(<BodenrichtwertInfo {...defaultInput} />);
      expect(screen.queryByRole("link")).toHaveTextContent(expectedText);
    }
  );

  it("Should display accordion on default page", async () => {
    defaultInput.allData = grundModelFactory.build();

    render(<BodenrichtwertInfo {...defaultInput} />);
    expect(
      screen.queryByText("Links zu länderspezifischen Bodenrichtwert-Portalen")
    ).toBeInTheDocument();
  });
});

export {};
