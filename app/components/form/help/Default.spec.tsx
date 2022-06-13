import { render, screen } from "@testing-library/react";
import DefaultHelp from "~/components/form/help/Default";

describe("Default Help", () => {
  it("should render paragraph", () => {
    const paragraphElement = { type: "paragraph" as const, value: "Hilfetext" };
    render(<DefaultHelp elements={[paragraphElement]} />);
    expect(screen.getByText(paragraphElement.value)).toBeInTheDocument();
  });

  it("should render image", () => {
    const imageElement = {
      type: "image" as const,
      source: "path/to/image",
      altText: "pretty image",
    };
    render(<DefaultHelp elements={[imageElement]} />);
    expect(screen.getByRole("img")).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute("src", imageElement.source);
    expect(screen.getByAltText(imageElement.altText)).toBeInTheDocument();
  });

  it("should render list", () => {
    const listElement = {
      type: "list" as const,
      intro: "Intro",
      items: ["Item 1", "Item 2"],
    };
    render(<DefaultHelp elements={[listElement]} />);
    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getByText(listElement.intro)).toBeInTheDocument();
    expect(screen.getByText(listElement.items[0])).toBeInTheDocument();
    expect(screen.getByText(listElement.items[1])).toBeInTheDocument();
  });

  it("should render elements in correct order", () => {
    const paragraphElement = { type: "paragraph" as const, value: "Hilfetext" };
    const imageElement = {
      type: "image" as const,
      source: "path/to/image",
      altText: "pretty image",
    };
    const listElement = {
      type: "list" as const,
      intro: "Intro",
      items: ["Item 1", "Item 2"],
    };
    const image2Element = {
      type: "image" as const,
      source: "path/to/image/2",
      altText: "very pretty image",
    };
    const { container } = render(
      <DefaultHelp
        elements={[paragraphElement, imageElement, listElement, image2Element]}
      />
    );

    const childNodes = container.firstChild?.childNodes;
    expect(childNodes?.length).toEqual(4);
    expect(childNodes?.[0]).toHaveTextContent(paragraphElement.value);
    expect(childNodes?.[1].childNodes[0]).toHaveAttribute(
      "src",
      imageElement.source
    );
    expect(childNodes?.[2]).toHaveTextContent(listElement.intro);
    expect(childNodes?.[3].childNodes[0]).toHaveAttribute(
      "src",
      image2Element.source
    );
  });
});
