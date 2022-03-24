import { StepComponentFunction } from "~/routes/formular/_step";
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
