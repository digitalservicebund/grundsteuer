import SteuernummerHelp from "~/components/form/help/Steuernummer";
import _ from "lodash";

export const helpComponents = {
  grundstueck: {
    steuernummer: { steuernummer: SteuernummerHelp },
  },
};

export const getHelpComponent = (path: string) => {
  const helpComponent = _.get(helpComponents, path);
  return helpComponent && helpComponent();
};
