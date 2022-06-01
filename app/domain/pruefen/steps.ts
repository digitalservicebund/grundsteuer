import { StepDefinition } from "~/domain/steps";
import _ from "lodash";

export const pruefenStepDefinitions: Record<string, StepDefinition> = {
  eigentuemerTyp: {
    fields: {
      eigentuemerTyp: {
        type: "radio",
        validations: {
          required: {},
        },
        options: [
          { value: "privatperson" },
          { value: "unternehmen" },
          { value: "beratung" },
        ],
      },
    },
  },
  erbengemeinschaft: {
    fields: {
      isErbengemeinschaft: {
        type: "radio",
        validations: {
          required: {},
        },
        options: [
          { value: "noErbengemeinschaft" },
          { value: "erbengemeinschaftInGrundbuch" },
          { value: "erbengemeinschaftNotInGrundbuch" },
        ],
      },
    },
  },
};

export const getPruefenStepDefinition = ({
  currentState,
}: {
  currentState: string;
}): StepDefinition => {
  return _.get(pruefenStepDefinitions, currentState);
};
