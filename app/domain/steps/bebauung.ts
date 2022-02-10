import BaseStep, { BaseDataData, BaseStepData } from "~/domain/steps/baseStep";
import { ConfigStepField, FieldType } from "~/domain";

export interface BebauungDataData extends BaseDataData {
  bebauung: string;
}

export class BebauungData extends BaseStepData {
  data: BebauungDataData;

  constructor(formData: Record<string, any>) {
    super();
    this.data = { bebauung: formData.get("bebauung") };
  }
  // TODO add validation here
}

export default class BebauungStep extends BaseStep {
  headline = "Bebauung des Grundstücks";
  fields: Array<ConfigStepField> = [
    {
      name: "bebauung",
      type: FieldType.Radio,
      label: "Das Grundstück ist",
      options: [
        {
          value: "unbebaut",
          label: "unbebaut",
        },
        {
          value: "bebaut",
          label: "bebaut",
        },
      ],
    },
  ];
  dataModel = BebauungData;
}
