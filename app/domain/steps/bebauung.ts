import {
  BaseDataData,
  baseRender,
  BaseStepData,
  Step,
} from "~/domain/steps/baseStep";
import { ConfigStepField, FieldType } from "~/domain";
import { AppData } from "@remix-run/react/data";

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

export default class BebauungStep implements Step {
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

  render(cookie: object, formData: Record<string, any>, actionData: AppData) {
    return baseRender(cookie, formData, actionData, {
      headline: this.headline,
      fields: this.fields,
      dataModel: this.dataModel,
    });
  }
}
