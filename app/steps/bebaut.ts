import BaseStep from "~/steps/baseStep";
import { ConfigStepField, FieldType } from "~/domain";

export default class BebautStep extends BaseStep {
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
}
