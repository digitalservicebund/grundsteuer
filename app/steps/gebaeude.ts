import BaseStep from "~/steps/baseStep";
import { ConfigStepField, FieldType } from "~/domain";

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
}
