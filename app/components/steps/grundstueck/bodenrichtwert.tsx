import {
  HelpComponentFunction,
  StepComponentFunction,
} from "~/routes/formular/_step";
import { StepFormFields } from "~/components";

const Bodenrichtwert: StepComponentFunction = ({
  stepDefinition,
  formData,
  allData,
  i18n,
  errors,
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
        <StepFormFields {...{ stepDefinition, formData, i18n, errors }} />
      </div>

      {(adresseData || flurstueckData) && (
        <p className="mb-4">{i18n.specifics.listHeading}</p>
      )}

      {adresseData && (
        <div data-testid="grundstueck-adresse" className="bg-gray-100 p-4 mb-8">
          <h2 className="font-bold mb-16">{i18n.specifics.adresseHeading}</h2>
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
              if (!flurstueck?.angaben || !flurstueck?.flur) {
                return;
              }
              return (
                <div key={index} className="bg-gray-100 p-4 mb-4">
                  <h2 className="font-bold mb-16">
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
                    {flurstueck.flur.flur && (
                      <li>
                        {i18n.specifics.flur}: {flurstueck.flur.flur}
                      </li>
                    )}
                    {flurstueck.flur.flurstueckZaehler && (
                      <li>
                        {i18n.specifics.flurstueckZaehler}:{" "}
                        {flurstueck.flur.flurstueckZaehler}
                      </li>
                    )}
                    {flurstueck.flur.flurstueckNenner && (
                      <li>
                        {i18n.specifics.flurstueckNenner}:{" "}
                        {flurstueck.flur.flurstueckNenner}
                      </li>
                    )}
                    {flurstueck.flur.wirtschaftlicheEinheitZaehler && (
                      <li>
                        {i18n.specifics.wirtschaftlicheEinheitZaehler}:{" "}
                        {flurstueck.flur.wirtschaftlicheEinheitZaehler}
                      </li>
                    )}
                    {flurstueck.flur.wirtschaftlicheEinheitNenner && (
                      <li>
                        {i18n.specifics.wirtschaftlicheEinheitNenner}:{" "}
                        {flurstueck.flur.wirtschaftlicheEinheitNenner}
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

const portalBB = (
  <a
    className="underline"
    target="_blank"
    href={"https://informationsportal-grundstuecksdaten.brandenburg.de"}
  >
    https://informationsportal-grundstuecksdaten.brandenburg.de
  </a>
);
const portalBE = (
  <a
    className="underline"
    target="_blank"
    href={"https://fbinter.stadt-berlin.de/boris/"}
  >
    https://fbinter.stadt-berlin.de/boris/
  </a>
);
const portalHB = (
  <a
    className="underline"
    target="_blank"
    href={
      "https://immobilienmarkt.niedersachsen.de/bodenrichtwerte?teilmarkt=Bauland&stichtag=2022-01-01&zoom=7.00"
    }
  >
    https://immobilienmarkt.niedersachsen.de/bodenrichtwerte?teilmarkt=Bauland&stichtag=2022-01-01&zoom=7.00
  </a>
);
const portalMV = (
  <a
    className="underline"
    target="_blank"
    href={"https://www.geodaten-mv.de/grundsteuerdaten/"}
  >
    https://www.geodaten-mv.de/grundsteuerdaten/
  </a>
);
const portalNW = (
  <a
    className="underline"
    target="_blank"
    href={"https://www.finanzverwaltung.nrw.de/Grundsteuerreform "}
  >
    https://www.finanzverwaltung.nrw.de/Grundsteuerreform
  </a>
);
const portalRP = (
  <a className="underline" target="_blank" href={"https://maps.rlp.de/"}>
    https://maps.rlp.de/
  </a>
);
const portalSH = (
  <a
    className="underline"
    target="_blank"
    href={"http://www.schleswig-holstein.de/grundsteuer"}
  >
    http://www.schleswig-holstein.de/grundsteuer
  </a>
);
const portalSL = (
  <a
    className="underline"
    target="_blank"
    href={"https://geoportal.saarland.de/Grundsteuer/"}
  >
    https://geoportal.saarland.de/Grundsteuer/
  </a>
);
const portalSN = (
  <a className="underline" target="_blank" href={"www.grundsteuer.sachsen.de"}>
    www.grundsteuer.sachsen.de
  </a>
);
const portalST = (
  <a
    className="underline"
    target="_blank"
    href={"https://www.grundsteuerdaten.sachsen-anhalt.de/"}
  >
    https://www.grundsteuerdaten.sachsen-anhalt.de/
  </a>
);
const portalTH = (
  <a
    className="underline"
    target="_blank"
    href={"https://thueringenviewer.thueringen.de/thviewer/grundsteuer.html"}
  >
    https://thueringenviewer.thueringen.de/thviewer/grundsteuer.html
  </a>
);

const introParagraph =
  "Geben Sie bitte im Eingabefeld den Bodenrichtwert an. Den Wert für Ihr Grundstück bzw. Ihre Flurstücke können Sie unter folgendem Link ermitteln:";

const GeneralHelp = () => {
  return (
    <>
      <div className="bg-blue-500 p-16 mb-32">
        <p className="font-bold">
          Um die für ihr Bundesland passende Hilfestellung für den
          Bodenrichtwert Ihres Grundstücks zu erhalten, wählen Sie bitte das
          Bundesland unter Grundstücksadresse aus.
        </p>
      </div>

      <h2 className="font-bold mb-16">Was ist der Bodenrichtwert?</h2>
      <p>
        Der Bodenrichtwert bietet einen Anhaltspunkt für die Einschätzung des
        Wertes eines Grundstücks. Er basiert auf regionalen Kaufpreisen und ist
        ein Durchschnittswert der Liegenschaftspreise einer Gemeinde, eines
        Gebiets oder eines Stadtteils.
      </p>

      <h2 className="font-bold mb-16">
        Wo finde ich den Bodenrichtwert meines Bundeslandes?
      </h2>
      <ol className="list-decimal ml-[23px] break-words">
        <li>Brandenburg: {portalBB}</li>
        <li>Berlin: {portalBE}</li>
        <li>Bremen: {portalHB}</li>
        <li>Mecklenburg-Vorpommern: {portalMV}</li>
        <li>Nordrhein-Westfahlen: {portalNW}</li>
        <li>Rheinland-Pfalz: {portalRP}</li>
        <li>Schleswig-Holstein: {portalSH}</li>
        <li>Saarland: {portalSL}</li>
        <li>Sachsen: {portalSN}</li>
        <li>Sachsen-Anhalt: {portalST}</li>
        <li>Thüringen: {portalTH}</li>
      </ol>
    </>
  );
};

const BBHelp = () => {
  return (
    <>
      <h2 className="font-bold mb-16">Bodenrichtwert Brandenburg</h2>
      <p>{introParagraph}</p>
      {portalBB}
    </>
  );
};

const BEHelp = () => {
  return (
    <>
      <h2 className="font-bold mb-16">Bodenrichtwert Berlin</h2>
      <p>{introParagraph}</p>
      {portalBE}
    </>
  );
};

const HBHelp = () => {
  return (
    <>
      <h2 className="font-bold mb-16">Bodenrichtwert Bremen</h2>
      <p>{introParagraph}</p>
      {portalHB}
    </>
  );
};

const MVHelp = () => {
  return (
    <>
      <h2 className="font-bold mb-16">Bodenrichtwert Mecklenburg-Vorpommern</h2>
      <p>{introParagraph}</p>
      {portalMV}
    </>
  );
};

const NWHelp = () => {
  return (
    <>
      <h2 className="font-bold mb-16">Bodenrichtwert Nordrhein-Westfahlen</h2>
      <p>{introParagraph}</p>
      {portalNW}
    </>
  );
};

const RPHelp = () => {
  return (
    <>
      <h2 className="font-bold mb-16">Bodenrichtwert Rheinland-Pfalz</h2>
      <p>{introParagraph}</p>
      {portalRP}
    </>
  );
};

const SHHelp = () => {
  return (
    <>
      <h2 className="font-bold mb-16">Bodenrichtwert Schleswig-Holstein</h2>
      <p>{introParagraph}</p>
      {portalSH}
    </>
  );
};

const SLHelp = () => {
  return (
    <>
      <h2 className="font-bold mb-16">Bodenrichtwert Saarland</h2>
      <p>{introParagraph}</p>
      {portalSL}
    </>
  );
};

const SNHelp = () => {
  return (
    <>
      <h2 className="font-bold mb-16">Bodenrichtwert Sachsen</h2>
      <p>{introParagraph}</p>
      {portalSN}
    </>
  );
};

const STHelp = () => {
  return (
    <>
      <h2 className="font-bold mb-16">Bodenrichtwert Sachsen-Anhalt</h2>
      <p>{introParagraph}</p>
      {portalST}
    </>
  );
};

const THHelp = () => {
  return (
    <>
      <h2 className="font-bold mb-16">Bodenrichtwert Thüringen</h2>
      <p>{introParagraph}</p>
      {portalTH}
    </>
  );
};

export const BodenrichtwertHelp: HelpComponentFunction = ({ allData }) => {
  const bundesland = allData?.grundstueck?.adresse?.bundesland;
  switch (bundesland) {
    case "BB":
      return <BBHelp />;
    case "BE":
      return <BEHelp />;
    case "HB":
      return <HBHelp />;
    case "MV":
      return <MVHelp />;
    case "NW":
      return <NWHelp />;
    case "RP":
      return <RPHelp />;
    case "SH":
      return <SHHelp />;
    case "SL":
      return <SLHelp />;
    case "SN":
      return <SNHelp />;
    case "ST":
      return <STHelp />;
    case "TH":
      return <THHelp />;
    default:
      return <GeneralHelp />;
  }
};
