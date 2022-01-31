import nextStep from "./nextStep";

/** Every step has its own url, so every step could be reached directly by the user.
 * We might not want that the user gets to a step without visiting the previous steps.
 * This function returns true, if:
 *   1. the given step is the planned next step
 *   or 2. the user already visited a step (and now might return to edit it)
 */
export default (stepName: string, records: any) => {
  console.log({ stepName, records });

  // inspired by "level unlocking" in video games ;)
  if (records && Object.keys(records).includes(stepName)) {
    console.log(`Allow step ${stepName} because the user visited it before.`);
    return true;
  }

  if (nextStep(records) === stepName) {
    console.log(`Allow step ${stepName} because it's the next planned step.`);
    return true;
  }

  console.error(`Disallow step ${stepName}!`);
  return false;
};
