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
        <div className="bg-gray-100">
          <h2 className="font-bold">Adressangaben: </h2>
          <ul>
            <li>
              {adresseData.strasse && <>{adresseData.strasse}</>}{" "}
              {adresseData.hausnummer && <>{adresseData.hausnummer}</>}
            </li>
            <li>
              {adresseData.plz && <>{adresseData.plz}</>}{" "}
              {adresseData.ort && <>{adresseData.ort}</>}
            </li>
            <li>
              {adresseData.zusatzangaben && <>{adresseData.zusatzangaben}</>}
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Bodenrichtwert;
