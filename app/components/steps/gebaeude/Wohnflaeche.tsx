import { StepComponentFunction } from "~/routes/formular/_step";
import { ContentContainer, StepFormFields } from "~/components";

const Wohnflaeche: StepComponentFunction = (props) => {
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

      <StepFormFields {...props} />
    </ContentContainer>
  );
};

export default Wohnflaeche;
