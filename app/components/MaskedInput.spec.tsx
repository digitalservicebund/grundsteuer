import { render, screen, waitFor } from "@testing-library/react";
import MaskedInput, { MaskedInputProps } from "~/components/MaskedInput";
import userEvent from "@testing-library/user-event";

describe("MaskedInput component", () => {
  const defaultProps: MaskedInputProps = {
    name: "input",
    label: "Input Label",
    mask: "000",
  };

  it("should render input field", () => {
    render(<MaskedInput {...defaultProps} />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("should not include placeholder", () => {
    render(<MaskedInput {...defaultProps} />);
    expect(screen.getByRole("textbox").getAttribute("placeholder")).toBeNull();
  });

  it("should not include help icon", () => {
    render(<MaskedInput {...defaultProps} />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("should render placeholder if given", () => {
    render(
      <MaskedInput {...{ ...defaultProps, placeholder: "PLACEHOLDER" }} />
    );
    expect(screen.queryByPlaceholderText("PLACEHOLDER")).toBeInTheDocument();
  });

  const cases = [
    { inputValue: "TypingValue", expectedValue: "" },
    { inputValue: "1Typing2Value3", expectedValue: "123" },
    { inputValue: "12345", expectedValue: "123" },
  ];

  test.each(cases)(
    "Should return $expectedValue if input value is $inputValue",
    ({ inputValue, expectedValue }) => {
      render(<MaskedInput {...defaultProps} />);
      userEvent.type(screen.getByRole("textbox"), inputValue);
      expect(screen.getByRole("textbox")).toHaveValue(expectedValue);
    }
  );

  describe("With help set", () => {
    it("should render help icon", () => {
      render(<MaskedInput {...{ ...defaultProps, help: "HELP TEXT" }} />);
      expect(screen.getByRole("img")).toBeInTheDocument();
    });

    it("should not display help text by default", () => {
      render(<MaskedInput {...{ ...defaultProps, help: "HELP TEXT" }} />);
      expect(screen.queryByText("HELP TEXT")).not.toBeVisible();
    });

    it("should not be expanded by default", () => {
      render(<MaskedInput {...{ ...defaultProps, help: "HELP TEXT" }} />);
      expect(screen.getByTestId("help-summary")).toHaveAttribute(
        "aria-expanded",
        "false"
      );
    });

    it("should display help text on icon click", () => {
      render(<MaskedInput {...{ ...defaultProps, help: "HELP TEXT" }} />);
      userEvent.click(screen.getByRole("img"));
      expect(screen.queryByText("HELP TEXT")).toBeVisible();
    });

    it("should expand according to icon clicks", async () => {
      render(<MaskedInput {...{ ...defaultProps, help: "HELP TEXT" }} />);
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
      render(<MaskedInput {...{ ...defaultProps, help: "HELP TEXT" }} />);
      userEvent.tab();
      expect(screen.getByTestId("help-summary")).toHaveFocus();
    });
  });
});
