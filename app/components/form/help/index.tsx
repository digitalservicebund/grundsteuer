import SteuernummerHelp from "~/components/form/help/Steuernummer";
import _ from "lodash";
import { GrundModel } from "~/domain/steps";
import { I18nObjectField } from "~/i18n/getStepI18n";
import DefaultHelpContent from "~/components/form/help/Default";

export const helpComponents = {
  grundstueck: {
    steuernummer: { steuernummer: SteuernummerHelp },
  },
};

export const getHelpComponent = ({
  path,
  allData,
  i18n,
  helpText,
}: {
  path: string;
  allData?: GrundModel;
  i18n?: I18nObjectField;
  helpText?: string;
}) => {
  const helpComponent = _.get(helpComponents, path);
  if (helpComponent) {
    return helpComponent({ allData, i18n });
  } else if (helpText) {
    return (
      <DefaultHelpContent elements={[{ type: "paragraph", value: helpText }]} />
    );
  }
};
