import BaseStep, { BaseDataData, BaseStepData } from "~/domain/steps/baseStep";
import { ConfigStepField, FieldType } from "~/domain";

export interface AdresseDataData extends BaseDataData {
  strasse: string;
  hausnummer: number;
}

export class AdresseData extends BaseStepData {
  data: AdresseDataData;

  constructor(formData: Record<string, any>) {
    super(formData);
    this.data = {
      strasse: formData.get("strasse"),
      hausnummer: formData.get("hausnummer"),
    };
  }

  // TODO add step-specific validation here
}

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
  dataModel = AdresseData;
}
