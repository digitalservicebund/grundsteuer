import { render, screen } from "@testing-library/react";
import { StepHeadline } from "~/components/StepHeadline";
import { I18nObject } from "~/i18n/getStepI18n";

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

  describe("With description set", () => {
    beforeEach(() => {
      defaultProps.description = "Describing the step";
    });

    it("should render description", () => {
      render(<StepHeadline i18n={defaultProps} />);
      expect(screen.getByText("Describing the step")).toBeInTheDocument();
    });
  });
});
