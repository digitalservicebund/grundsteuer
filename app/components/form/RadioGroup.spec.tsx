import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RadioGroup from "./RadioGroup";

describe("RadioGroup component", () => {
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
    render(<RadioGroup {...defaultProps} />);
    expect(screen.getByText("Input Label")).toBeInTheDocument();
  });

  it("should render all options", () => {
    render(<RadioGroup {...defaultProps} />);
    expect(screen.getByLabelText("Option 1")).toBeInTheDocument();
    expect(screen.getByLabelText("Option 2")).toBeInTheDocument();
  });

  it("should not include help icon", () => {
    render(<RadioGroup {...defaultProps} />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  describe("With help set", () => {
    const defaultPropsWithHelp = {
      name: "input",
      label: "Input Label",
      options: [
        {
          value: "1",
          label: "Option 1",
          help: <p>Help 1</p>,
        },
        {
          value: "2",
          label: "Option 2",
          help: <p>Help 2</p>,
        },
      ],
    };

    it("should render help icons", () => {
      render(<RadioGroup {...defaultPropsWithHelp} />);
      expect(screen.getAllByRole("img")).toHaveLength(2);
    });

    it("should not display help text by default", () => {
      render(<RadioGroup {...defaultPropsWithHelp} />);
      expect(screen.queryByText("Help 1")).not.toBeVisible();
      expect(screen.queryByText("Help 2")).not.toBeVisible();
    });

    it("should not be expanded by default", () => {
      render(<RadioGroup {...defaultPropsWithHelp} />);
      screen.getAllByTestId("help-summary").forEach((summary) => {
        expect(summary).toHaveAttribute("aria-expanded", "false");
      });
    });

    it("should display the correct help text on icon click", async () => {
      render(<RadioGroup {...defaultPropsWithHelp} />);
      await userEvent.click(
        within(screen.getByTestId("option-1")).getByRole("img")
      );
      expect(screen.queryByText("Help 1")).toBeVisible();
      expect(screen.queryByText("Help 2")).not.toBeVisible();
    });

    it("should expand according to icon clicks", async () => {
      render(<RadioGroup {...defaultPropsWithHelp} />);
      await userEvent.click(
        within(screen.getByTestId("option-1")).getByRole("img")
      );
      await waitFor(() => {
        expect(
          within(screen.getByTestId("option-1")).getByTestId("help-summary")
        ).toHaveAttribute("aria-expanded", "true");
      });
      expect(
        within(screen.getByTestId("option-2")).getByTestId("help-summary")
      ).toHaveAttribute("aria-expanded", "false");
      await userEvent.click(
        within(screen.getByTestId("option-1")).getByRole("img")
      );
      await waitFor(() => {
        expect(
          within(screen.getByTestId("option-1")).getByTestId("help-summary")
        ).toHaveAttribute("aria-expanded", "false");
      });
      expect(
        within(screen.getByTestId("option-2")).getByTestId("help-summary")
      ).toHaveAttribute("aria-expanded", "false");
    });

    it("should focus first summary on tab tab", async () => {
      render(<RadioGroup {...defaultPropsWithHelp} />);
      await userEvent.tab();
      await userEvent.tab();
      expect(
        within(screen.getByTestId("option-1")).getByTestId("help-summary")
      ).toHaveFocus();
    });
  });
});
