import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RadioWithImageGroup from "./RadioWithImageGroup";
import feature2Image from "~/assets/images/feature2.svg";
import feature3Image from "~/assets/images/feature3.svg";

describe("RadioWithImageGroup component", () => {
  const defaultProps = {
    name: "input",
    label: "Input Label",
    options: [
      {
        value: "1",
        label: "Option 1",
        image: feature2Image,
        imageAltText: "This is the image description for image 1",
      },
      {
        value: "2",
        label: "Option 2",
        image: feature3Image,
        imageAltText: "This is the image description for image 2",
      },
    ],
  };

  it("should render label", () => {
    render(<RadioWithImageGroup {...defaultProps} />);
    expect(screen.getByText("Input Label")).toBeInTheDocument();
  });

  it("should render all options", () => {
    render(<RadioWithImageGroup {...defaultProps} />);
    expect(screen.getByLabelText("Option 1")).toBeInTheDocument();
    expect(screen.getByLabelText("Option 2")).toBeInTheDocument();
  });

  it("should not include help icon", () => {
    render(<RadioWithImageGroup {...defaultProps} />);
    expect(screen.getAllByRole("img")).toHaveLength(2);
  });

  it("should include first image", () => {
    render(<RadioWithImageGroup {...defaultProps} />);
    expect(screen.getAllByRole("img")[0]).toHaveAttribute("src", feature3Image);
  });

  it("should include alt text for first image", () => {
    render(<RadioWithImageGroup {...defaultProps} />);
    expect(screen.getAllByRole("img")[0]).toHaveAttribute(
      "alt",
      "This is the image description for image 1"
    );
  });

  it("should include second image", () => {
    render(<RadioWithImageGroup {...defaultProps} />);
    expect(screen.getAllByRole("img")[1]).toHaveAttribute("src", feature3Image);
  });

  it("should include alt text for second image", () => {
    render(<RadioWithImageGroup {...defaultProps} />);
    expect(screen.getAllByRole("img")[1]).toHaveAttribute(
      "alt",
      "This is the image description for image 2"
    );
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
          image: feature2Image,
          imageAltText: "This is the image description for image 1",
        },
        {
          value: "2",
          label: "Option 2",
          help: <p>Help 2</p>,
          image: feature3Image,
          imageAltText: "This is the image description for image 2",
        },
      ],
    };

    it("should render help icons", () => {
      render(<RadioWithImageGroup {...defaultPropsWithHelp} />);
      expect(screen.getAllByRole("img")).toHaveLength(4);
    });

    it("should not display help text by default", () => {
      render(<RadioWithImageGroup {...defaultPropsWithHelp} />);
      expect(screen.queryByText("Help 1")).not.toBeVisible();
      expect(screen.queryByText("Help 2")).not.toBeVisible();
    });

    it("should not be expanded by default", () => {
      render(<RadioWithImageGroup {...defaultPropsWithHelp} />);
      screen.getAllByTestId("help-summary").forEach((summary) => {
        expect(summary).toHaveAttribute("aria-expanded", "false");
      });
    });

    it("should display the correct help text on icon click", async () => {
      render(<RadioWithImageGroup {...defaultPropsWithHelp} />);
      await userEvent.click(
        within(screen.getByTestId("option-1")).getAllByRole("img")[1]
      );
      expect(screen.queryByText("Help 1")).toBeVisible();
      expect(screen.queryByText("Help 2")).not.toBeVisible();
    });

    it("should expand according to icon clicks", async () => {
      render(<RadioWithImageGroup {...defaultPropsWithHelp} />);
      await userEvent.click(
        within(screen.getByTestId("option-1")).getAllByRole("img")[1]
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
        within(screen.getByTestId("option-1")).getAllByRole("img")[1]
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
      render(<RadioWithImageGroup {...defaultPropsWithHelp} />);
      await userEvent.tab();
      await userEvent.tab();
      expect(
        within(screen.getByTestId("option-1")).getByTestId("help-summary")
      ).toHaveFocus();
    });
  });
});
