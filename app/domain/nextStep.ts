import config from "~/stepConfig";

/** Decide which step a user should visit next.
 * Algorithm is simple (at the moment :D):
 *   1. go through all possible steps from start to end
 *   2. take the first step which is
 *     a) not yet done and
 *     b) has no condition which evaluates to false
 *
 * If no steps are found, all steps are done and next state is "zusammenfassung".
 */
export default (records: any) => {
  const finishedSteps = records ? Object.keys(records) : [];

  const next = config.steps.find((step) => {
    const finished = finishedSteps.includes(step.name);
    const conditionFulfilled = step.condition ? step.condition(records) : true;

    return !finished && conditionFulfilled;
  });

  return next ? next.name : "zusammenfassung";
};
