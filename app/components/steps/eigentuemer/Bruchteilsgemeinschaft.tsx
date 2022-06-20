import { StepComponentFunction } from "~/routes/formular/_step";
import { Button, ContentContainer, StepFormFields } from "~/components";
import Person from "~/components/icons/mui/Person";
import House from "~/components/icons/mui/House";
import ArrowRight from "~/components/icons/mui/ArrowRight";

const constructBruchteilsgemeinschaftName = (
  strasse: string,
  hausnummer: string
) => {
  return `Bruchteilsgemeinschaft ${strasse} ${hausnummer}`;
};

const Bruchteilsgemeinschaft: StepComponentFunction = ({
  stepDefinition,
  currentState,
  formData,
  allData,
  i18n,
  errors,
}) => {
  const grundstueckAdresseData = allData?.grundstueck?.adresse;
  const eigentuemer1AdresseData = allData?.eigentuemer?.person?.[0]?.adresse;

  return (
    <ContentContainer size="sm-md">
      <div className="bg-white p-16 mb-8">
        <div className="mb-8">
          <Person height="25px" width="25px" className="inline-block mr-8" />
          <h3 className="font-bold inline-block uppercase text-11">
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
          <>
            <p className="mb-16 text-18">{i18n.specifics.nameMissing}</p>
            <Button
              look="tertiary"
              size="medium"
              href="/formular/grundstueck/adresse"
              icon={<ArrowRight />}
            >
              {i18n.specifics.grundstueckAdresseLinkText}
            </Button>
          </>
        )}
      </div>
      <div className="bg-white p-16 mb-32">
        <div className="mb-8">
          <House height="25px" width="25px" className="inline-block mr-8" />
          <h3 className="font-bold inline-block uppercase text-11">
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
          <>
            <p className="mb-16 text-18">{i18n.specifics.adresseMissing}</p>
            <Button
              look="tertiary"
              size="medium"
              href="/formular/eigentuemer/person/1/adresse"
              icon={<ArrowRight />}
            >
              {i18n.specifics.eigentuemerAdresseLinkText}
            </Button>
          </>
        )}
      </div>
      <div className="mb-8">
        <StepFormFields
          {...{ stepDefinition, currentState, formData, i18n, errors }}
        />
      </div>
    </ContentContainer>
  );
};

export default Bruchteilsgemeinschaft;
