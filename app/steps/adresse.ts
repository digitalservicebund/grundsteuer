import BaseStep from "~/steps/baseStep";
import { ConfigStepField, FieldType } from "~/domain";

export default class AdresseStep extends BaseStep {
  headline = "Lage des Grundstücks";
  fields: Array<ConfigStepField> = [
    {
      name: "strasse",
      type: FieldType.Text,
      label: "Straße",
    },
    {
      name: "hausnummer",
      type: FieldType.Text,
      label: "Hausnummer",
    },
  ];
}
