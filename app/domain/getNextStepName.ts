import type { Config } from "~/stepConfig";

export const finalStepName = "zusammenfassung";

export const getNextStepName = ({
  config,
  records,
}: {
  config: Config;
  records: any;
}) => {
  const visitedStepNames = Object.keys(records || {});

  return (
    config.steps.find(({ name, condition }) => {
      const visited = visitedStepNames.includes(name);
      if (visited) return false;

      const unfulfilledCondition = condition && !condition(records);
      if (unfulfilledCondition) return false;

      return true;
    })?.name || finalStepName
  );
};
