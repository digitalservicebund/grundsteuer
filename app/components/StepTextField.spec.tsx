import { render, screen } from "@testing-library/react";
import StepTextField from "~/components/StepTextField";

describe("StepTextField component", () => {
  const defaultProps = {
    name: "input",
    label: "Input Label",
  };

  it("should render input field", () => {
    render(<StepTextField {...defaultProps} />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("should not include placeholder", () => {
    render(<StepTextField {...defaultProps} />);
    expect(screen.getByRole("textbox").getAttribute("placeholder")).toBeNull();
  });

  describe("With placeholder set", () => {
    it("should render placeholder", () => {
      render(
        <StepTextField {...{ ...defaultProps, placeholder: "PLACEHOLDER" }} />
      );
      expect(screen.queryByPlaceholderText("PLACEHOLDER")).toBeInTheDocument();
    });
  });
});
