import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import StepTextField from "~/components/StepTextField";
import userEvent from "@testing-library/user-event";
import { wait } from "@testing-library/user-event/dist/utils";

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

  it("should not include help icon", () => {
    render(<StepTextField {...defaultProps} />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("should render placeholder if given", () => {
    render(
      <StepTextField {...{ ...defaultProps, placeholder: "PLACEHOLDER" }} />
    );
    expect(screen.queryByPlaceholderText("PLACEHOLDER")).toBeInTheDocument();
  });

  describe("With help set", () => {
    it("should render help icon", () => {
      render(<StepTextField {...{ ...defaultProps, help: "HELP TEXT" }} />);
      expect(screen.getByRole("img")).toBeInTheDocument();
    });

    it("should not display help text by default", () => {
      render(<StepTextField {...{ ...defaultProps, help: "HELP TEXT" }} />);
      expect(screen.queryByText("HELP TEXT")).not.toBeVisible();
    });

    it("should not be expanded by default", () => {
      render(<StepTextField {...{ ...defaultProps, help: "HELP TEXT" }} />);
      expect(screen.getByTestId("help-summary")).toHaveAttribute(
        "aria-expanded",
        "false"
      );
    });

    it("should display help text on icon click", () => {
      render(<StepTextField {...{ ...defaultProps, help: "HELP TEXT" }} />);
      userEvent.click(screen.getByRole("img"));
      expect(screen.queryByText("HELP TEXT")).toBeVisible();
    });

    it("should expand according to icon clicks", async () => {
      render(<StepTextField {...{ ...defaultProps, help: "HELP TEXT" }} />);
      userEvent.click(screen.getByRole("img"));
      await waitFor(() => {
        expect(screen.getByTestId("help-summary")).toHaveAttribute(
          "aria-expanded",
          "true"
        );
      });
      userEvent.click(screen.getByRole("img"));
      await waitFor(() => {
        expect(screen.getByTestId("help-summary")).toHaveAttribute(
          "aria-expanded",
          "false"
        );
      });
    });

    it("should focus summary on tab", () => {
      render(<StepTextField {...{ ...defaultProps, help: "HELP TEXT" }} />);
      userEvent.tab();
      expect(screen.getByTestId("help-summary")).toHaveFocus();
    });
  });
});
