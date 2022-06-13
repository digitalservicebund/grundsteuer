import { render, screen, waitFor } from "@testing-library/react";
import Input from "./Input";
import userEvent from "@testing-library/user-event";

describe("Input component", () => {
  const defaultProps = {
    name: "input",
    label: "Input Label",
  };

  it("should render input field", () => {
    render(<Input {...defaultProps} />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("should not include placeholder", () => {
    render(<Input {...defaultProps} />);
    expect(screen.getByRole("textbox").getAttribute("placeholder")).toBeNull();
  });

  it("should not include help icon", () => {
    render(<Input {...defaultProps} />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("should render placeholder if given", () => {
    render(<Input {...{ ...defaultProps, placeholder: "PLACEHOLDER" }} />);
    expect(screen.queryByPlaceholderText("PLACEHOLDER")).toBeInTheDocument();
  });

  it("should store the typed text as value", async () => {
    const inputValue = "TypingValue";
    render(<Input {...defaultProps} />);
    await userEvent.type(screen.getByRole("textbox"), inputValue);
    expect(screen.getByRole("textbox")).toHaveValue(inputValue);
  });

  describe("With help set", () => {
    it("should render help icon", () => {
      render(<Input {...{ ...defaultProps, help: <p>HELP TEXT</p> }} />);
      expect(screen.getByRole("img")).toBeInTheDocument();
    });

    it("should not display help text by default", () => {
      render(<Input {...{ ...defaultProps, help: <p>HELP TEXT</p> }} />);
      expect(screen.queryByText("HELP TEXT")).not.toBeVisible();
    });

    it("should not be expanded by default", () => {
      render(<Input {...{ ...defaultProps, help: <p>HELP TEXT</p> }} />);
      expect(screen.getByTestId("help-summary")).toHaveAttribute(
        "aria-expanded",
        "false"
      );
    });

    it("should display help text on icon click", async () => {
      render(<Input {...{ ...defaultProps, help: <p>HELP TEXT</p> }} />);
      await userEvent.click(screen.getByRole("img"));
      expect(screen.queryByText("HELP TEXT")).toBeVisible();
    });

    it("should expand according to icon clicks", async () => {
      render(<Input {...{ ...defaultProps, help: <p>HELP TEXT</p> }} />);
      await userEvent.click(screen.getByRole("img"));
      await waitFor(() => {
        expect(screen.getByTestId("help-summary")).toHaveAttribute(
          "aria-expanded",
          "true"
        );
      });
      await userEvent.click(screen.getByRole("img"));
      await waitFor(() => {
        expect(screen.getByTestId("help-summary")).toHaveAttribute(
          "aria-expanded",
          "false"
        );
      });
    });

    it("should focus summary on tab tab", async () => {
      render(<Input {...{ ...defaultProps, help: <p>HELP TEXT</p> }} />);
      await userEvent.tab();
      await userEvent.tab();
      expect(screen.getByTestId("help-summary")).toHaveFocus();
    });
  });
});
