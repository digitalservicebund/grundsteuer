import BebauungStep from "~/domain/steps/bebauung";
import AdresseStep from "~/domain/steps/adresse";
import GebaeudeStep from "~/domain/steps/gebaeude";
import BaseStep from "~/domain/steps/baseStep";

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
