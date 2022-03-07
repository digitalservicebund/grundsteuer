import { I18nObject } from "~/routes/formular/_step";
import { getI18nObject } from "test/factories/i18n";
import { render, screen } from "@testing-library/react";
import Freitext from "~/components/steps/eigentuemer/freitext";
import { eigentuemerFreitext } from "~/domain/steps/eigentuemer/freitext";

describe("Freitext page component", () => {
  const defaultInput = {
    stepDefinition: eigentuemerFreitext,
    formData: {},
    allData: {},
    i18n: {} as I18nObject,
    backUrl: "back/url",
    currentStateWithoutId: "current/state",
    errors: {},
  };

  beforeEach(async () => {
    defaultInput.i18n = await getI18nObject("eigentuemer.freitext");
  });

  it("should render input field", () => {
    render(<Freitext {...defaultInput} />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("should render warning", () => {
    render(<Freitext {...defaultInput} />);
    expect(
      screen.getByText(
        "Achtung, wenn Sie hier etwas eintragen, dann werden Sie ausgesteuert."
      )
    ).toBeInTheDocument();
  });
});
