import { render, screen, within } from "@testing-library/react";
import { getI18nObject } from "test/factories/i18n";
import { I18nObject } from "~/i18n/getStepI18n";
import { grundstueckFlurstueckMiteigentumsanteil } from "~/domain/steps/grundstueck/flurstueck/miteigentum.server";
import FlurstueckMiteigentumsanteil from "~/components/steps/grundstueck/flurstueck/FlurstueckMiteigentumsanteil";

describe("Miteigentumsanteil page component", () => {
  const defaultInput = {
    stepDefinition: grundstueckFlurstueckMiteigentumsanteil,
    formData: {},
    allData: {},
    i18n: {} as I18nObject,
    backUrl: "back/url",
    currentStateWithoutId: "current/state",
    errors: {},
  };

  beforeEach(async () => {
    defaultInput.i18n = await getI18nObject(
      "grundstueck.flurstueck.miteigentum"
    );
  });

  it("should render all input fields", () => {
    render(<FlurstueckMiteigentumsanteil {...defaultInput} />);
    expect(screen.getByLabelText("Anteil Zähler")).toBeInTheDocument();
    expect(screen.getByLabelText("Anteil Nenner")).toBeInTheDocument();
  });

  it("should render zähler and nenner in a fieldset with an image", () => {
    render(<FlurstueckMiteigentumsanteil {...defaultInput} />);
    const fieldsets = screen.getAllByRole("group");
    expect(
      within(fieldsets[0]).getByLabelText("Anteil Zähler")
    ).toBeInTheDocument();
    expect(
      within(fieldsets[0]).getByLabelText("Schrägstrich")
    ).toBeInTheDocument();
    expect(
      within(fieldsets[0]).getByLabelText("Anteil Nenner")
    ).toBeInTheDocument();
  });
});

export {};
