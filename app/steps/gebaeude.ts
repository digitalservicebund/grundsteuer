import BaseStep from "~/steps/baseStep";
import { ConfigStepField, FieldType } from "~/domain";

export class GebaeudeData {
  gebaeudeart: string;

  constructor(gebaeudeart: string) {
    this.gebaeudeart = gebaeudeart;
  }
  // TODO add validation here
}

export default class GebaeudeStep extends BaseStep {
  static headline = "Gebäude auf dem Grundstück";
  static fields: Array<ConfigStepField> = [
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
  static dataModel = GebaeudeData;
}
