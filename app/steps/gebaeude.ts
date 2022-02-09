import BaseStep, { BaseDataData, BaseStepData } from "~/steps/baseStep";
import { ConfigStepField, FieldType } from "~/domain";
import invariant from "tiny-invariant";

export interface GebaeudeDataData extends BaseDataData {
  gebaeudeart: string;
}

export class GebaeudeData extends BaseStepData {
  data: GebaeudeDataData;

  constructor(formData: Record<string, any>) {
    super(formData);
    invariant(formData.get("gebaeudeart"), "Expected gebaeudeart");
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
