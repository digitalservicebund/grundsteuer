import { StepComponentFunction } from "~/routes/formular/_step";
import { StepFormFields } from "~/components";

const Bodenrichtwert: StepComponentFunction = ({
  stepDefinition,
  formData,
  allData,
  i18n,
}) => {
  const adresseData = allData?.grundstueck?.adresse;
  const flurstueckData = allData?.grundstueck?.flurstueck;
  const flurstueckAnzahl = allData?.grundstueck?.anzahl?.anzahl;
  return (
    <div>
      <div className="mb-16">
        <p className="mb-2">{i18n.specifics.explanation}</p>
        <a
          href="https://www.bodenrichtwerte-boris.de/"
          target="_blank"
          rel="noopener"
          className="underline"
        >
          www.bodenrichtwerte-boris.de
        </a>
      </div>

      <div className="mb-8">
        <StepFormFields {...{ stepDefinition, formData, i18n }} />
      </div>

      {(adresseData || flurstueckData) && (
        <p className="mb-4">{i18n.specifics.listHeading}</p>
      )}

      {adresseData && (
        <div data-testid="grundstueck-adresse" className="bg-gray-100 p-4 mb-8">
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
      {flurstueckData && (
        <div data-testid="grundstueck-flurstuecke">
          {flurstueckData
            .slice(0, Number(flurstueckAnzahl || 1))
            .map((flurstueck, index) => {
              if (!flurstueck?.angaben) {
                return;
              }
              return (
                <div key={index} className="bg-gray-100 p-4 mb-4">
                  <h2 className="font-bold">
                    {i18n.specifics.flurstueckHeading} {index + 1}
                  </h2>
                  <ul>
                    <li>
                      {i18n.specifics.grundbuchblatt}:{" "}
                      {flurstueck.angaben.grundbuchblattnummer}
                    </li>
                    <li>
                      {i18n.specifics.gemarkung}: {flurstueck.angaben.gemarkung}
                    </li>
                    {flurstueck.angaben.flur && (
                      <li>
                        {i18n.specifics.flur}: {flurstueck.angaben.flur}
                      </li>
                    )}
                    {flurstueck.angaben.flurstueckZaehler && (
                      <li>
                        {i18n.specifics.flurstueckZaehler}:{" "}
                        {flurstueck.angaben.flurstueckZaehler}
                      </li>
                    )}
                    {flurstueck.angaben.flurstueckNenner && (
                      <li>
                        {i18n.specifics.flurstueckNenner}:{" "}
                        {flurstueck.angaben.flurstueckNenner}
                      </li>
                    )}
                    {flurstueck.angaben.wirtschaftlicheEinheitZaehler && (
                      <li>
                        {i18n.specifics.wirtschaftlicheEinheitZaehler}:{" "}
                        {flurstueck.angaben.wirtschaftlicheEinheitZaehler}
                      </li>
                    )}
                    {flurstueck.angaben.wirtschaftlicheEinheitNenner && (
                      <li>
                        {i18n.specifics.wirtschaftlicheEinheitNenner}:{" "}
                        {flurstueck.angaben.wirtschaftlicheEinheitNenner}
                      </li>
                    )}
                  </ul>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default Bodenrichtwert;
