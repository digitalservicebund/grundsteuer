import { StepComponentFunction } from "~/routes/__infoLayout/pruefen/_step";
import { FormGroup, RadioGroup } from "~/components";
import Hint from "~/components/Hint";

const options = [
  {
    value: "true",
    label: "Private Nutzung",
    description: (
      <>
        <p>
          Beispiele für privat genutzte Flächen sind: Garten, kleines
          Gemüsebeet/Obstwiese für den eigenen Bedarf, Kfz Stellplatz,
          Lagerfläche für Brennholz/Gartengeräte oder private Tierhaltung
        </p>
        <Hint overrideMargin={true} className="my-16">
          Diese Flächen werden dem Grundvermögen zugerechnet.
        </Hint>
        und/oder
        <ul className="mb-8 ml-20 list-disc">
          <li>
            Die land- und forstwirtschaftlichen Flächen Ihres Grundstücks sind
            in einem Bebauungsplan als Bauland festgesetzt. Die sofortige
            Bebauung ist möglich und die Bebauung innerhalb des Plangebiets in
            benachbarten Bereichen hat begonnen oder ist schon durchgeführt
          </li>
          <li>
            Sie erwarten, dass die Flächen bis zum Jahr 2029 zu anderen Zwecken
            beispielsweise als Bau-, Gewerbe- oder Industrieland genutzt werden
          </li>
        </ul>
      </>
    ),
  },
  {
    value: "false",
    label:
      "Brach liegend/ungenutzt, verpachtet oder land- und forstwirtschaftliche Nutzung",
    description: (
      <>
        <p>
          Beispiele für land- und forstwirtschaftliche Flächen sind: Acker,
          Wiese, Wald oder Stallungen
        </p>
        <Hint overrideMargin={true} className="my-16">
          Diese Flächen werden dem land- und forstwirtschaftlichen Vermögen
          zugerechnet. Unabhängig von Größe und Anzahl der Flächen.
        </Hint>
        <p>und/oder</p>
        <ul className="mb-8 ml-20 list-disc">
          <li>
            Land- und forstwirtschaftliche Flächen liegen aktuell brach und
            werden nicht genutzt
          </li>
          <li>
            Flächen und Gebäude werden land- und forstwirtschaftlich genutzt
            oder verpachtet. Die gewonnenen Erzeugnisse, beispielsweise aus
            Tier- und Pflanzenerzeugung, werden wirtschaftlich genutzt
          </li>
          <li>
            Aktuell brachliegende, ungenutzte land- und forstwirtschaftlich
            Flächen sollen bis zum Jahr 2029 wieder wirtschaftlich genutzt
            werden
          </li>
        </ul>
      </>
    ),
  },
];

const NutzungsartBebaut: StepComponentFunction = (props) => {
  return (
    <FormGroup>
      <RadioGroup
        {...props}
        {...{ error: props.errors?.["privat"] }}
        name="privat"
        options={options}
      />
    </FormGroup>
  );
};

export default NutzungsartBebaut;
