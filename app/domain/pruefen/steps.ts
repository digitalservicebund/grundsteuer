import { infoStep, StepDefinition } from "~/domain/steps";
import _ from "lodash";
import invariant from "tiny-invariant";

export const pruefenStepDefinitions: Record<string, StepDefinition> = {
  start: {
    fields: {
      abgeber: {
        type: "radio",
        options: [
          { value: "eigentuemer" },
          { value: "angehoerig" },
          { value: "keinEigentuemer" },
          { value: "eigentuemerNeu" },
          { value: "steuerberater" },
        ],
        validations: {
          required: { msg: "Bitte treffen Sie eine Auswahl" },
        },
      },
    },
  },
  eigentuemerTyp: {
    fields: {
      eigentuemerTyp: {
        type: "radio",
        options: [
          { value: "privatperson" },
          { value: "erbengemeinschaft" },
          { value: "mehrereErben" },
          { value: "unternehmen" },
        ],
        validations: {
          required: { msg: "Bitte treffen Sie eine Auswahl" },
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
          { value: "nichtWohn" },
          { value: "unbebaut" },
          { value: "landUndForst" },
        ],
        validations: {
          required: { msg: "Bitte treffen Sie eine Auswahl" },
        },
      },
    },
  },
  ausland: {
    fields: {
      ausland: {
        type: "radio",
        options: [{ value: "false" }, { value: "true" }],
        validations: {
          required: { msg: "Bitte treffen Sie eine Auswahl" },
        },
      },
    },
  },
  fremderBoden: {
    fields: {
      fremderBoden: {
        type: "radio",
        options: [
          { value: "false" },
          { value: "true" },
          { value: "noBuilding" },
        ],
        validations: {
          required: { msg: "Bitte treffen Sie eine Auswahl" },
        },
      },
    },
  },
  beguenstigung: {
    fields: {
      beguenstigung: {
        type: "radio",
        options: [{ value: "false" }, { value: "true" }],
        validations: {
          required: { msg: "Bitte treffen Sie eine Auswahl" },
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
          required: { msg: "Bitte treffen Sie eine Auswahl" },
        },
      },
    },
  },
  elster: {
    fields: {
      elster: {
        type: "radio",
        options: [{ value: "false" }, { value: "true" }],
        validations: {
          required: { msg: "Bitte treffen Sie eine Auswahl" },
        },
      },
    },
  },
  nutzung: infoStep,
  keineNutzung: infoStep,
  spaeterNutzung: infoStep,
};

export const getPruefenStepDefinition = ({
  currentState,
}: {
  currentState: string;
}): StepDefinition => {
  const definition = _.get(pruefenStepDefinitions, currentState);
  invariant(
    definition,
    `No pruefen step definition found for ${currentState}.`
  );
  return definition;
};
