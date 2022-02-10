import { steps } from "./steps";
import { conditions, Conditions } from "./conditions";
import { GrundDataModelData } from "~/domain/model";

const transform = (step: any, context: GrundDataModelData) => {
  if (!step.states) return null;
  return Object.entries(step.states).reduce((acc: any, [k, v]: any) => {
    if (v.meta && v.meta.visibilityCond) {
      if (!conditions[v.meta.visibilityCond as keyof Conditions](context)) {
        return acc;
      }
    }
    const steps = transform(v, context);
    const entry: any = { id: k };
    if (v.meta && v.meta.resource) entry.resourceId = 1;
    if (v.meta && v.meta.title) entry.title = v.meta.title;
    if (steps) entry["steps"] = steps;
    return [...acc, entry];
  }, []);
};

export const stepNavigation = (context: GrundDataModelData) => {
  const staticSteps = transform(steps, context);
  // console.log(JSON.stringify(staticSteps, null, 2));

  return staticSteps;
};
