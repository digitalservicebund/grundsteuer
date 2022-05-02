import { HelpComponentFunction } from "~/routes/formular/_step";
import { Trans } from "react-i18next";

export const BruchteilsgemeinschaftHelp: HelpComponentFunction = ({
  allData,
  i18n,
}) => {
  const grundstueckAdresseData = allData?.grundstueck?.adresse;
  const eigentuemer1AdresseData = allData?.eigentuemer?.person?.[0]?.adresse;

  const whatExplanationComponent = (
    <>
      <h2 className="mb-8 font-bold text-18">{i18n.help.whatHeadline}</h2>
      <p>
        <Trans components={{ bold: <strong /> }}>
          {i18n.help.whatParagraph1}
        </Trans>
      </p>
      <ul className="mb-16 list-disc pl-24">
        <li>
          <Trans components={{ bold: <strong /> }}>
            {i18n.help.whatListItem1}
          </Trans>
        </li>
        <li>
          <Trans components={{ bold: <strong /> }}>
            {i18n.help.whatListItem2}
          </Trans>
        </li>
      </ul>
      <p className="mb-32">
        <Trans components={{ bold: <strong /> }}>
          {i18n.help.whatParagraph2}
        </Trans>
      </p>
    </>
  );

  return (
    <>
      {grundstueckAdresseData && eigentuemer1AdresseData && (
        <>
          {whatExplanationComponent}
          <h2 className="mb-8 font-bold text-18">{i18n.help.nameHeadline}</h2>
          <p className="mb-8">{i18n.help.nameParagraph1}</p>
          <p className="mb-32">
            <Trans components={{ italic: <i /> }}>
              {i18n.help.nameParagraph2}
            </Trans>
          </p>

          <h2 className="mb-8 font-bold text-18">
            {i18n.help.addressHeadline}
          </h2>
          <p>{i18n.help.addressParagraph1}</p>
        </>
      )}
      {!grundstueckAdresseData && eigentuemer1AdresseData && (
        <>
          <div className="bg-blue-500 mb-24 p-16">
            <strong>{i18n.help.noNameDisclaimer}</strong>
          </div>
          {whatExplanationComponent}
        </>
      )}
      {grundstueckAdresseData && !eigentuemer1AdresseData && (
        <>
          <div className="bg-blue-500 mb-24 p-16">
            <strong>{i18n.help.noAddressDisclaimer}</strong>
          </div>
          {whatExplanationComponent}
        </>
      )}
      {!grundstueckAdresseData && !eigentuemer1AdresseData && (
        <>
          <div className="bg-blue-500 mb-24 p-16">
            <strong>{i18n.help.noNameAndAddressDisclaimer}</strong>
          </div>
          {whatExplanationComponent}
        </>
      )}
    </>
  );
};
