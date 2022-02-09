import BebauungStep from "~/steps/bebauung";
import AdresseStep from "~/steps/adresse";
import GebaeudeStep from "~/steps/gebaeude";
import BaseStep from "~/steps/baseStep";

const stepLookup: Record<string, typeof BaseStep> = {
  adresse: AdresseStep,
  bebauung: BebauungStep,
  gebaeude: GebaeudeStep,
};

export function lookupStep(stepName: string): BaseStep {
  const matchedStep = stepLookup[stepName];
  if (matchedStep == undefined) {
    throw Error("invalid step name");
  }
  return new matchedStep();
}
