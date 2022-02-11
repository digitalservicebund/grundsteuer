import BebauungStep from "~/domain/steps/bebauung";
import AdresseStep from "~/domain/steps/adresse";
import GebaeudeStep from "~/domain/steps/gebaeude";
import { Step } from "~/domain/steps/baseStep";

const stepLookup: Record<string, Step> = {
  adresse: new AdresseStep(),
  bebauung: new BebauungStep(),
  gebaeude: new GebaeudeStep(),
};

export function lookupStep(stepName: string): Step | false {
  const matchedStep = stepLookup[stepName];
  if (typeof matchedStep === "undefined") {
    // throw Error("invalid step name");
    return false;
  }
  return matchedStep;
}
