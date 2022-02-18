import { ConfigStepFieldRadio } from "~/domain";

export const verheiratetField: ConfigStepFieldRadio = {
  name: "areVerheiratet",
  validations: {},
  options: [
    {
      value: "true",
    },
    {
      value: "false",
    },
  ],
};
