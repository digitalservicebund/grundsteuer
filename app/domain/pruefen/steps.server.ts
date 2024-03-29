import { infoStep, StepDefinition } from "~/domain/steps/index.server";
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
  abgeber: {
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
  bewohnbar: {
    fields: {
      bewohnbar: {
        type: "radio",
        options: [
          { value: "bewohnbar" },
          { value: "unbewohnbar" },
          { value: "unbebaut" },
        ],
        validations: {
          required: { msg: "Bitte treffen Sie eine Auswahl" },
        },
      },
    },
  },
  gebaeudeArtBewohnbar: {
    fields: {
      gebaeude: {
        type: "radio",
        options: [
          { value: "einfamilienhaus" },
          { value: "zweifamilienhaus" },
          { value: "eigentumswohnung" },
          { value: "hof" },
          { value: "mehrfamilienhaus" },
        ],
        validations: {
          required: { msg: "Bitte treffen Sie eine Auswahl" },
        },
      },
    },
  },
  gebaeudeArtUnbewohnbar: {
    fields: {
      gebaeude: {
        type: "radio",
        options: [
          { value: "garage" },
          { value: "imBau" },
          { value: "verfallen" },
          { value: "wochenendhaus" },
          { value: "geschaeft" },
          { value: "luf" },
          { value: "other" },
        ],
        validations: {
          required: { msg: "Bitte treffen Sie eine Auswahl" },
        },
      },
    },
  },
  gebaeudeArtUnbebaut: {
    fields: {
      art: {
        type: "radio",
        options: [
          { value: "baureif" },
          { value: "acker" },
          { value: "garten" },
          { value: "moor" },
          { value: "other" },
        ],
        validations: {
          required: { msg: "Bitte treffen Sie eine Auswahl" },
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
  nutzungsartUnbebaut: {
    fields: {
      privat: {
        type: "radio",
        options: [{ value: "true" }, { value: "false" }],
        validations: {
          required: { msg: "Bitte treffen Sie eine Auswahl" },
        },
      },
    },
  },
  nutzungsartBebaut: {
    fields: {
      privat: {
        type: "radio",
        options: [{ value: "true" }, { value: "false" }],
        validations: {
          required: { msg: "Bitte treffen Sie eine Auswahl" },
        },
      },
    },
  },
  keineNutzung: infoStep,
  nutzung: infoStep,
  mehrereErklaerungen: infoStep,
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
