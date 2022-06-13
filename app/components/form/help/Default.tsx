import { ReactElement } from "react";
import { GrundModel } from "~/domain/steps";
import { PruefenModel } from "~/domain/pruefen/model";
import { I18nObjectField } from "~/i18n/getStepI18n";

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

export type HelpComponentFunction = ({
  allData,
}: {
  allData: GrundModel | PruefenModel;
  i18n: I18nObjectField;
}) => JSX.Element;

export const getElementComponents = (elements: HelpConfigurationElement[]) => {
  return elements.map((element, index) => {
    let elementComponent = <></>;
    if (element.type == "paragraph") {
      elementComponent = <p>{element.value}</p>;
    }
    if (element.type == "list") {
      elementComponent = (
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
      elementComponent = <img src={element.source} alt={element.altText} />;
    }
    return (
      <div key={index} className="mb-32">
        {elementComponent}
      </div>
    );
  });
};

const DefaultHelpContent = (props: HelpDefaultProps) => {
  const { elements } = props;

  const elementComponents: Array<ReactElement> = getElementComponents(elements);

  return <>{elementComponents}</>;
};

export default DefaultHelpContent;
