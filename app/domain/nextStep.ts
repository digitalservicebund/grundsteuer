import type { Config } from "~/stepConfig";

export const finalStepName = "zusammenfassung";

/** Decide which step a user should visit next.
 * Algorithm is simple (at the moment :D):
 *   1. go through all possible steps from start to end
 *   2. take the first step which is
 *     a) not yet done and
 *     b) has no condition which evaluates to false
 *
 * If no steps are found, all steps are done and next state is "zusammenfassung".
 */
export const nextStep = ({
  config,
  records,
}: {
  config: Config;
  records: any;
}) => {
  return (
    config.steps.find(({ name, condition }) => {
      return !(
        Object.keys(records || {}).includes(name) ||
        (condition && !condition(records))
      );
    })?.name || finalStepName
  );
};
