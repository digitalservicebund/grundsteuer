import { render, screen } from "@testing-library/react";
import { ImageLightbox } from "~/components/ImageLightbox";
import { StyleSheetTestUtils } from "aphrodite";
import userEvent from "@testing-library/user-event";

describe("ImageLightbox component", () => {
  const defaultProps = {
    thumbnail: "thumbnail/path",
    image: "image/path",
    altText: "alt text",
  };

  beforeEach(() => {
    // Needed to not get an error on style injection on the lightbox
    StyleSheetTestUtils.suppressStyleInjection();
  });
  afterEach(() => {
    StyleSheetTestUtils.clearBufferAndResumeStyleInjection();
  });

  it("should render thumbnail for mobile + bigger and enlarge icon", () => {
    render(<ImageLightbox {...defaultProps} />);
    expect(screen.getAllByRole("img")).toHaveLength(3);
    expect(screen.getAllByRole("img")[0]).toHaveAttribute(
      "src",
      defaultProps.thumbnail
    );
    expect(screen.getAllByRole("img")[1]).toEqual(
      screen.getByTestId("enlarge-icon")
    );
    expect(screen.getAllByRole("img")[2]).toHaveAttribute(
      "src",
      defaultProps.thumbnail
    );
  });

  it("should have alt text on thumbnail", () => {
    render(<ImageLightbox {...defaultProps} />);
    expect(screen.getAllByRole("img")[0]).toHaveAttribute(
      "alt",
      defaultProps.altText
    );
  });

  it("should open lightbox on click", () => {
    render(<ImageLightbox {...defaultProps} />);
    screen.getByTestId("enlarge-button").click();
    expect(screen.getAllByRole("img")).toHaveLength(4);
    expect(screen.getAllByRole("img")[0]).toHaveAttribute(
      "src",
      defaultProps.thumbnail
    );
    expect(screen.getAllByRole("img")[1]).toEqual(
      screen.getByTestId("enlarge-icon")
    );
    expect(screen.getAllByRole("img")[2]).toHaveAttribute(
      "src",
      defaultProps.thumbnail
    );
    expect(screen.getAllByRole("img")[3]).toHaveAttribute(
      "src",
      defaultProps.image
    );
  });

  it("should have alt text on opened image in lightbox", () => {
    render(<ImageLightbox {...defaultProps} />);
    screen.getByTestId("enlarge-button").click();
    expect(screen.getAllByRole("img")[2]).toHaveAttribute(
      "alt",
      defaultProps.altText
    );
  });

  it("should focus button on tab", () => {
    render(<ImageLightbox {...defaultProps} />);
    userEvent.tab();
    expect(screen.getByTestId("enlarge-button")).toHaveFocus();
  });
});
