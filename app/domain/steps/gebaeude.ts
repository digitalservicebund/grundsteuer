import BaseStep, { BaseDataData, BaseStepData } from "~/domain/steps/baseStep";
import { ConfigStepField, FieldType } from "~/domain";

export interface GebaeudeDataData extends BaseDataData {
  gebaeudeart: string;
}

export class GebaeudeData extends BaseStepData {
  data: GebaeudeDataData;

  constructor(formData: Record<string, any>) {
    super(formData);
    this.data = {
      gebaeudeart: formData.get("gebaeudeart"),
    };
  }
  // TODO add validation here
}

export default class GebaeudeStep extends BaseStep {
  headline = "Gebäude auf dem Grundstück";
  fields: Array<ConfigStepField> = [
    {
      name: "gebaeudeart",
      type: FieldType.Select,
      label: "Art des Gebäudes",
      options: [
        {
          value: "einfamilienhaus",
          label: "Einfamilienhaus",
        },
        {
          value: "reihenhaus",
          label: "Reihenhaus",
        },
        {
          value: "mehrfamilienhaus",
          label: "Mehrfamilienhaus",
        },
      ],
    },
  ];
  dataModel = GebaeudeData;
}
