import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import StepRadioField from "~/components/StepRadioField";

describe("StepRadioField component", () => {
  const defaultProps = {
    name: "input",
    label: "Input Label",
    options: [
      {
        value: "1",
        label: "Option 1",
      },
      {
        value: "2",
        label: "Option 2",
      },
    ],
  };

  it("should render label", () => {
    render(<StepRadioField {...defaultProps} />);
    expect(screen.getByText("Input Label")).toBeInTheDocument();
  });

  it("should render all options", () => {
    render(<StepRadioField {...defaultProps} />);
    expect(screen.getByLabelText("Option 1")).toBeInTheDocument();
    expect(screen.getByLabelText("Option 2")).toBeInTheDocument();
  });

  it("should not include help icon", () => {
    render(<StepRadioField {...defaultProps} />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  describe("With help set", () => {
    const defaultProps = {
      name: "input",
      label: "Input Label",
      options: [
        {
          value: "1",
          label: "Option 1",
          help: "Help 1",
        },
        {
          value: "2",
          label: "Option 2",
          help: "Help 2",
        },
      ],
    };

    it("should render help icons", () => {
      render(<StepRadioField {...defaultProps} />);
      expect(screen.getAllByRole("img")).toHaveLength(2);
    });

    it("should not display help text by default", () => {
      render(<StepRadioField {...defaultProps} />);
      expect(screen.queryByText("Help 1")).not.toBeVisible();
      expect(screen.queryByText("Help 2")).not.toBeVisible();
    });

    it("should not be expanded by default", () => {
      render(<StepRadioField {...defaultProps} />);
      screen.getAllByTestId("help-summary").forEach((summary) => {
        expect(summary).toHaveAttribute("aria-expanded", "false");
      });
    });

    it("should display the correct help text on icon click", () => {
      render(<StepRadioField {...defaultProps} />);
      userEvent.click(within(screen.getByTestId("option-1")).getByRole("img"));
      expect(screen.queryByText("Help 1")).toBeVisible();
      expect(screen.queryByText("Help 2")).not.toBeVisible();
    });

    it("should expand according to icon clicks", async () => {
      render(<StepRadioField {...defaultProps} />);
      userEvent.click(within(screen.getByTestId("option-1")).getByRole("img"));
      await waitFor(() => {
        expect(
          within(screen.getByTestId("option-1")).getByTestId("help-summary")
        ).toHaveAttribute("aria-expanded", "true");
      });
      expect(
        within(screen.getByTestId("option-2")).getByTestId("help-summary")
      ).toHaveAttribute("aria-expanded", "false");
      userEvent.click(within(screen.getByTestId("option-1")).getByRole("img"));
      await waitFor(() => {
        expect(
          within(screen.getByTestId("option-1")).getByTestId("help-summary")
        ).toHaveAttribute("aria-expanded", "false");
      });
      expect(
        within(screen.getByTestId("option-2")).getByTestId("help-summary")
      ).toHaveAttribute("aria-expanded", "false");
    });

    it("should focus first summary on tab", () => {
      render(<StepRadioField {...defaultProps} />);
      userEvent.tab();
      expect(
        within(screen.getByTestId("option-1")).getByTestId("help-summary")
      ).toHaveFocus();
    });
  });
});
