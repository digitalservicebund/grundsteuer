import {
  BaseDataData,
  baseRender,
  BaseStepData,
  Step,
} from "~/domain/steps/baseStep";
import { ConfigStepField, FieldType } from "~/domain";
import { AppData } from "@remix-run/react/data";

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

export default class AdresseStep implements Step {
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

  render(cookie: object, formData: Record<string, any>, actionData: AppData) {
    return baseRender(cookie, formData, actionData, {
      headline: this.headline,
      fields: this.fields,
      dataModel: this.dataModel,
    });
  }
}
