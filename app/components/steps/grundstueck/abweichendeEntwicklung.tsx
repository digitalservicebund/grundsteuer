import { HelpComponentFunction } from "~/routes/formular/_step";
import { Trans } from "react-i18next";

export const AbweichendeEntwicklungHelp: HelpComponentFunction = ({ i18n }) => {
  return (
    <>
      <h2 className="font-bold mb-8">{i18n.help.heading}</h2>
      <p className="mb-8">{i18n.help.paragraph1}</p>
      <p className="mb-8">
        <Trans components={{ bold: <strong /> }}>{i18n.help.paragraph2}</Trans>
      </p>
      <p className="mb-8">
        <Trans components={{ bold: <strong /> }}>{i18n.help.paragraph3}</Trans>
      </p>
    </>
  );
};
