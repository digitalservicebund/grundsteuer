import { ReactElement } from "react";

type HelpConfigurationElement =
  | ParagraphHelpConfiguration
  | ListHelpConfiguration
  | ImageHelpConfiguration;

type ParagraphHelpConfiguration = {
  type: "paragraph";
  value: string;
};

type ListHelpConfiguration = {
  type: "list";
  intro?: string;
  items: string[];
};

type ImageHelpConfiguration = {
  type: "image";
  source: string;
  altText: string;
};

export type HelpDefaultProps = {
  elements: HelpConfigurationElement[];
};

export type HelpComponentFunction = () => JSX.Element;

const DefaultHelp = (props: HelpDefaultProps) => {
  const { elements } = props;

  const elementComponents: Array<ReactElement> = elements.map((element) => {
    if (element.type == "paragraph") {
      return <p>{element.value}</p>;
    }
    if (element.type == "list") {
      return (
        <>
          <p>{element.intro}</p>
          <ul className="list-disc ml-[15px]">
            {element.items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </>
      );
    }
    if (element.type == "image") {
      return <img src={element.source} alt={element.altText} />;
    }
    return <></>;
  });

  return (
    <div>
      {elementComponents.map((component, index) => {
        return (
          <div key={index} className="mb-32">
            {component}
          </div>
        );
      })}
    </div>
  );
};

export default DefaultHelp;
