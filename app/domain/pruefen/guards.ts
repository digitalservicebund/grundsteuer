import { PruefenMachineContext } from "~/domain/pruefen/states";

export type PruefenCondition = (
  context: PruefenMachineContext | undefined
) => boolean;
export type PruefenConditions = Record<string, PruefenCondition>;

const isNotPrivatperson: PruefenCondition = (context) => {
  return context?.eigentuemerTyp?.eigentuemerTyp !== "privatperson";
};

export const pruefenConditions: PruefenConditions = {
  isNotPrivatperson,
};
