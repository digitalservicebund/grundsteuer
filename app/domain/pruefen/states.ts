import { MachineConfig } from "xstate";
import { PruefenModel } from "~/domain/pruefen/model";
export type PruefenMachineContext = PruefenModel;

export const pruefenStates: MachineConfig<any, any, any> = {
  id: "steps",
  initial: "eigentuemerTyp",
  states: {
    eigentuemerTyp: {
      on: {
        NEXT: [
          {
            target: "failure",
            cond: "isNotPrivatperson",
          },
          { target: "erbengemeinschaft" },
        ],
      },
    },
    erbengemeinschaft: {
      on: {
        BACK: { target: "eigentuemerTyp" },
        NEXT: [{ target: "failure" }],
      },
    },
    failure: {
      on: {
        BACK: [
          {
            target: "eigentuemerTyp",
            cond: "isNotPrivatperson",
          },
          { target: "erbengemeinschaft" },
        ],
      },
    },
  },
};

export const getPruefenConfig = (formData: PruefenMachineContext) => {
  return Object.assign({}, pruefenStates, { context: formData });
};
