import { render, screen } from "@testing-library/react";
import { StepHeadline } from "~/components/StepHeadline";
import { I18nObject } from "~/routes/formular/_step";

describe("StepHeadline component", () => {
  const defaultProps: I18nObject = {
    headline: "HEADLINE",
    fields: {},
    specifics: {},
    help: {},
    nextButtonLabel: "next",
    common: {},
  };

  it("should render headline", () => {
    render(<StepHeadline i18n={defaultProps} />);
    expect(screen.getByText("HEADLINE")).toBeInTheDocument();
  });

  describe("With headline help set", () => {
    beforeEach(() => {
      defaultProps.headlineHelp = "HELP TEXT";
    });

    it("should render headline help", () => {
      render(<StepHeadline i18n={defaultProps} />);
      expect(screen.getByText("HELP TEXT")).toBeInTheDocument();
    });

    it("should not make headline help visible by default", () => {
      render(<StepHeadline i18n={defaultProps} />);
      expect(screen.getByText("HELP TEXT")).not.toBeVisible();
    });
  });
});
