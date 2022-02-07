import BebautStep from "~/steps/bebaut";
import AdresseStep from "~/steps/adresse";
import GebaeudeStep from "~/steps/gebaeude";
import BaseStep from "~/steps/baseStep";

const stepLookup: Record<string, typeof BaseStep> = {
  adresse: AdresseStep,
  bebauung: BebautStep,
  gebaeude: GebaeudeStep,
};

export function lookupStep(stepName: string) {
  const matchedStep = stepLookup[stepName];
  if (matchedStep == undefined) {
    throw Error("invalid step name");
  }
  return matchedStep;
}
