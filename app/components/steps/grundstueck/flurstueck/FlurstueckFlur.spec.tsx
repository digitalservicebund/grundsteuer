import { render, screen, within } from "@testing-library/react";
import { getI18nObject } from "test/factories/i18n";
import { grundstueckFlurstueckFlur } from "~/domain/steps/grundstueck/flurstueck/flur";
import Flur from "~/components/steps/grundstueck/flurstueck/FlurstueckFlur";
import { I18nObject } from "~/i18n/getStepI18n";

describe("Flur page component", () => {
  const defaultInput = {
    stepDefinition: grundstueckFlurstueckFlur,
    formData: {},
    allData: {},
    i18n: {} as I18nObject,
    backUrl: "back/url",
    currentStateWithoutId: "current/state",
    errors: {},
  };

  beforeEach(async () => {
    defaultInput.i18n = await getI18nObject("grundstueck.flurstueck.flur");
  });

  it("should render all input fields", () => {
    render(<Flur {...defaultInput} />);
    expect(screen.getByLabelText("Flur")).toBeInTheDocument();
    expect(screen.getByLabelText("Flurstück Zähler")).toBeInTheDocument();
    expect(screen.getByLabelText("Flurstück Nenner")).toBeInTheDocument();
    expect(
      screen.getByLabelText("Wirtsch. Einheit Zähler")
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("Wirtsch. Einheit Nenner")
    ).toBeInTheDocument();
  });

  it("should render zähler and nenner in a fieldset with an image", () => {
    render(<Flur {...defaultInput} />);
    const fieldsets = screen.getAllByRole("group");
    expect(
      within(fieldsets[0]).getByLabelText("Flurstück Zähler")
    ).toBeInTheDocument();
    expect(within(fieldsets[0]).getByRole("img")).toBeInTheDocument();
    expect(
      within(fieldsets[0]).getByLabelText("Flurstück Nenner")
    ).toBeInTheDocument();
    expect(
      within(fieldsets[1]).getByLabelText("Wirtsch. Einheit Zähler")
    ).toBeInTheDocument();
    expect(within(fieldsets[1]).getByRole("img")).toBeInTheDocument();
    expect(
      within(fieldsets[1]).getByLabelText("Wirtsch. Einheit Nenner")
    ).toBeInTheDocument();
  });
});

export {};
