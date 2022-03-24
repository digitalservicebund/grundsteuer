import {
  HelpComponentFunction,
  StepComponentFunction,
} from "~/routes/formular/_step";
import { StepFormFields } from "~/components";
import { Trans } from "react-i18next";
import Person from "~/components/icons/mui/Person";
import House from "~/components/icons/mui/House";

const constructBruchteilsgemeinschaftName = (
  strasse: string,
  hausnummer: string
) => {
  return `Bruchteilsgemeinschaft ${strasse} ${hausnummer}`;
};

const Bruchteilsgemeinschaft: StepComponentFunction = ({
  stepDefinition,
  formData,
  allData,
  i18n,
}) => {
  const grundstueckAdresseData = allData?.grundstueck?.adresse;
  const eigentuemer1AdresseData = allData?.eigentuemer?.person?.[0]?.adresse;

  return (
    <div>
      <p className="mb-16">{i18n.specifics.explanation}</p>
      <h2 className="text-20">{i18n.specifics.subheading}</h2>

      <div className="bg-gray-300 p-16 mb-8">
        <div className="mb-8">
          <Person height="25px" width="25px" className="inline-block mr-8" />
          <h3 className="font-bold inline-block">
            {i18n.specifics.nameHeading}
          </h3>
        </div>
        {grundstueckAdresseData && (
          <p>
            {constructBruchteilsgemeinschaftName(
              grundstueckAdresseData.strasse,
              grundstueckAdresseData.hausnummer
            )}
          </p>
        )}
        {!grundstueckAdresseData && (
          <p>
            <Trans
              components={{
                grundstueckAdresseLink: (
                  <a
                    href="/formular/grundstueck/adresse"
                    className="underline"
                  />
                ),
              }}
            >
              {i18n.specifics.nameMissing}
            </Trans>
          </p>
        )}
      </div>
      <div className="bg-gray-300 p-16 mb-32">
        <div className="mb-8">
          <House height="25px" width="25px" className="inline-block mr-8" />
          <h3 className="font-bold inline-block">
            {i18n.specifics.adresseHeading}
          </h3>
        </div>
        {eigentuemer1AdresseData && (
          <p>
            {eigentuemer1AdresseData.strasse}{" "}
            {eigentuemer1AdresseData.hausnummer}{" "}
            {eigentuemer1AdresseData.postfach}
            <br />
            {eigentuemer1AdresseData.plz} {eigentuemer1AdresseData.ort}
          </p>
        )}
        {!eigentuemer1AdresseData && (
          <p>
            <Trans
              components={{
                eigentuemerAdresseLink: (
                  <a
                    href="/formular/eigentuemer/person/1/adresse"
                    className="underline"
                  />
                ),
              }}
            >
              {i18n.specifics.adresseMissing}
            </Trans>
          </p>
        )}
      </div>
      <div className="mb-8">
        <StepFormFields {...{ stepDefinition, formData, i18n }} />
      </div>
    </div>
  );
};

export default Bruchteilsgemeinschaft;

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
