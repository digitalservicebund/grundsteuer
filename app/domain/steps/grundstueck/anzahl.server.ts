import { FieldOptions, StepDefinition } from "~/domain/steps/index.server";

const values = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
  "22",
  "23",
  "24",
  "25",
  "26",
  "27",
  "28",
  "29",
  "30",
  "31",
  "32",
  "33",
  "34",
  "35",
  "36",
  "37",
  "38",
  "39",
  "40",
  "41",
  "42",
  "43",
  "44",
  "45",
] as const;

export type GrundstueckAnzahlFields = {
  anzahl: typeof values[number]; // "1" | ... | "45"
};

const options: FieldOptions = [{ value: "default", defaultOption: true }];
values.forEach((value) => {
  options.push({ value });
});

export const grundstueckAnzahl: StepDefinition = {
  fields: {
    anzahl: {
      type: "select",
      validations: {
        required: {},
      },
      options,
    },
  },
};
