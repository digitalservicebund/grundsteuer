import { StepDefinition } from "~/domain/steps";
import _ from "lodash";

export const pruefenStepDefinitions: Record<string, StepDefinition> = {
  eigentuemerTyp: {
    fields: {
      eigentuemerTyp: {
        type: "radio",
        options: [
          { value: "privatperson" },
          { value: "unternehmen" },
          { value: "beratung" },
        ],
        validations: {
          required: {},
        },
      },
    },
  },
  erbengemeinschaft: {
    fields: {
      isErbengemeinschaft: {
        type: "radio",
        options: [
          { value: "noErbengemeinschaft" },
          { value: "erbengemeinschaftInGrundbuch" },
          { value: "erbengemeinschaftNotInGrundbuch" },
        ],
        validations: {
          required: {},
        },
      },
    },
  },
  bundesland: {
    fields: {
      bundesland: {
        type: "select",
        options: [
          { value: "default", defaultOption: true },
          { value: "BW" },
          { value: "BY" },
          { value: "BE" },
          { value: "BB" },
          { value: "HB" },
          { value: "HH" },
          { value: "HE" },
          { value: "MV" },
          { value: "NI" },
          { value: "NW" },
          { value: "RP" },
          { value: "SL" },
          { value: "SN" },
          { value: "ST" },
          { value: "SH" },
          { value: "TH" },
        ],
        validations: {
          required: {},
        },
      },
    },
  },
  grundstueckArt: {
    fields: {
      grundstueckArt: {
        type: "radio",
        options: [
          { value: "einfamilienhaus" },
          { value: "zweifamilienhaus" },
          { value: "eigentumswohnung" },
          { value: "mehrfamilienhaus" },
          { value: "mehrereGebaeude" },
          { value: "nichtWohn" },
          { value: "unbebaut" },
          { value: "landUndForst" },
        ],
        validations: {
          required: {},
        },
      },
    },
  },
  garagen: {
    fields: {
      garagen: {
        type: "radio",
        options: [
          { value: "garageAufGrundstueck" },
          { value: "garageAufAnderemGrundstueck" },
          { value: "tiefgarage" },
          { value: "keine" },
        ],
        validations: {
          required: {},
        },
      },
    },
  },
  ausland: {
    fields: {
      ausland: {
        type: "radio",
        options: [{ value: "true" }, { value: "false" }],
        validations: {
          required: {},
        },
      },
    },
  },
  fremderBoden: {
    fields: {
      fremderBoden: {
        type: "radio",
        options: [{ value: "true" }, { value: "false" }],
        validations: {
          required: {},
        },
      },
    },
  },
  beguenstigung: {
    fields: {
      beguenstigung: {
        type: "radio",
        options: [{ value: "true" }, { value: "false" }],
        validations: {
          required: {},
        },
      },
    },
  },
  elster: {
    fields: {
      elster: {
        type: "radio",
        options: [{ value: "true" }, { value: "false" }],
        validations: {
          required: {},
        },
      },
    },
  },
};

export const getPruefenStepDefinition = ({
  currentState,
}: {
  currentState: string;
}): StepDefinition => {
  console.log(currentState);
  return _.get(pruefenStepDefinitions, currentState);
};
