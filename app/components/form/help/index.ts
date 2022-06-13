import SteuernummerHelp from "~/components/form/help/Steuernummer";
import _ from "lodash";
import { GrundModel } from "~/domain/steps";
import { I18nObjectField } from "~/i18n/getStepI18n";

export const helpComponents = {
  grundstueck: {
    steuernummer: { steuernummer: SteuernummerHelp },
  },
};

export const getHelpComponent = ({
  path,
  allData,
  i18n,
}: {
  path: string;
  allData?: GrundModel;
  i18n?: I18nObjectField;
}) => {
  const helpComponent = _.get(helpComponents, path);
  return helpComponent && helpComponent({ allData, i18n });
};
