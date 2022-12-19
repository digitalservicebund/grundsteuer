import { StepComponentFunction } from "~/routes/formular/_step";
import { ContentContainer, StepFormField } from "~/components";
import { getFieldProps } from "~/util/getFieldProps";

const Wohnflaechen: StepComponentFunction = (props) => {
  const fieldProps = getFieldProps(
    props.stepDefinition,
    props.formData,
    props.i18n,
    props.errors
  );
  return (
    <ContentContainer size="sm-md">
      <p className="mb-8">
        In der Regel sind die Größen der Wohn- und Nutzflächen im Grundriss,
        Kaufvertrag oder Bauunterlagen zu finden. Liegen diese Angaben nicht
        mehr vor, müssen Sie Ihre Flächen neu vermessen:
      </p>
      <ul className="mb-8 ml-20 list-disc">
        <li>
          Rechnen Sie die Größe aller Räume zusammen. Zum Beispiel Schlafzimmer,
          Küche, Bad, Flur oder häusliches Arbeitszimmer
        </li>
        <li>
          Auch Nutzflächen wie zum Beispiel Vereinsräume, Werkstätten oder
          Verkaufsläden werden mitgezählt
        </li>
        <li>Wintergärten zählen zur Hälfte</li>
        <li>
          Balkone, Loggien, Dachgärten und Terrassen zählen zu einem Viertel
        </li>
        <li>
          Nicht mitgerechnet werden zum Beispiel Keller, Schuppen und Garagen
        </li>
      </ul>
      <p className="mb-32">
        <a
          href="https://grundsteuererklaerung-fuer-privateigentum.zammad.com/help/de-de/44/52"
          target="_blank"
          rel="noopener"
          className="underline font-bold"
        >
          In unserem Hilfebereich
        </a>{" "}
        finden Sie eine vollständige Auflistung.
      </p>

      <fieldset className="mb-32">
        <legend className="uppercase font-bold text-11 mb-8">Wohnung 1</legend>
        <StepFormField {...fieldProps[0]} currentState={props.currentState} />
      </fieldset>

      <fieldset className="mb-80">
        <legend className="uppercase font-bold text-11 mb-8">Wohnung 2</legend>
        <StepFormField {...fieldProps[1]} currentState={props.currentState} />
      </fieldset>
    </ContentContainer>
  );
};

export default Wohnflaechen;
