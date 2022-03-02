import { StepComponentFunction } from "~/routes/formular/_step";
import Default from "~/components/steps/default";

const Bodenrichtwert: StepComponentFunction = ({
  stepDefinition,
  formData,
  allData,
  i18n,
  backUrl,
  currentStateWithoutId,
  errors,
}) => {
  const adresseData = allData?.grundstueck?.adresse;
  const flurstueckData = allData?.grundstueck?.flurstueck;
  return (
    <div>
      <Default
        {...{
          stepDefinition,
          formData,
          allData,
          i18n,
          backUrl,
          currentStateWithoutId,
          errors,
        }}
      />
      {adresseData && (
        <div className="bg-gray-100 mb-8">
          <h2 className="font-bold">{i18n.specifics.adresseHeading}</h2>
          <ul>
            <li>
              {adresseData.strasse} {adresseData.hausnummer}
            </li>
            <li>
              {adresseData.plz} {adresseData.ort}
            </li>
            <li>{adresseData.zusatzangaben}</li>
          </ul>
        </div>
      )}
      {flurstueckData &&
        flurstueckData.map((flurstueck, index) => {
          return (
            <div key={index} className="bg-gray-100 mb-4">
              <h2 className="font-bold">
                {i18n.specifics.flurstueckHeading} {index + 1}
              </h2>
              <ul>
                <li>
                  {i18n.specifics.grundbuchblatt}:{" "}
                  {flurstueck.angaben?.grundbuchblattnummer}
                </li>
                <li>
                  {i18n.specifics.gemarkung}: {flurstueck.angaben?.gemarkung}
                </li>
                <li>
                  {i18n.specifics.flur}: {flurstueck.angaben?.flur}
                </li>
                <li>
                  {i18n.specifics.flurstueckZaehler}:{" "}
                  {flurstueck.angaben?.flurstueckZaehler}
                </li>
                <li>
                  {i18n.specifics.flurstueckNenner}:{" "}
                  {flurstueck.angaben?.flurstueckNenner}
                </li>
              </ul>
            </div>
          );
        })}
    </div>
  );
};

export default Bodenrichtwert;
