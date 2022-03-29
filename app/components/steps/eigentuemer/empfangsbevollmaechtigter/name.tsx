import { HelpComponentFunction } from "~/routes/formular/_step";
import { Trans } from "react-i18next";
import { conditions } from "~/domain/guards";

export const EmpfangsbevollmaechtigterNameHelp: HelpComponentFunction = ({
  i18n,
  allData,
}) => {
  if (conditions.isBruchteilsgemeinschaft(allData)) {
    return (
      <>
        <h2 className="font-bold mb-16">{i18n.help.heading}</h2>
        <p className="mb-16">{i18n.help.p1}</p>
        <p className="mb-16">{i18n.help.p2}</p>
        <p className="mb-16">
          <Trans components={{ underline: <span className="underline" /> }}>
            {i18n.help.p3}
          </Trans>
        </p>
      </>
    );
  } else {
    return <></>;
  }
};
