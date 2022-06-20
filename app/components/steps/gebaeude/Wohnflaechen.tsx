import { StepComponentFunction } from "~/routes/formular/_step";
import { ContentContainer, StepFormField, StepFormFields } from "~/components";
import { getFieldProps } from "~/util/getFieldProps";

const Wohnflaechen: StepComponentFunction = (props) => {
  const fieldProps = getFieldProps(
    props.stepDefinition,
    props.formData,
    props.i18n,
    props.errors
  );
  return (
    <ContentContainer size="sm">
      <p>
        In der Regel sind die Größen der Wohnflächen im Grundriss, Kaufvertrag
        oder Bauunterlagen zu finden. Finden Sie diese Angaben nicht mehr,
        müssen Sie Ihre Wohnfläche neu vermessen:
      </p>
      <ul className="mb-32 ml-20 list-disc">
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

      <fieldset className="mb-32">
        <legend className="uppercase font-bold text-11 mb-8">Wohnung 1</legend>
        <StepFormField {...fieldProps[0]} />
      </fieldset>

      <fieldset className="mb-80">
        <legend className="uppercase font-bold text-11 mb-8">Wohnung 2</legend>
        <StepFormField {...fieldProps[1]} />
      </fieldset>
    </ContentContainer>
  );
};

export default Wohnflaechen;
