import { getNextStepName } from "./getNextStepName";
import type { Config } from "~/domain/config";
import type { Records } from "~/domain/records";

export const isStepAllowed = ({
  name,
  config,
  records,
}: {
  name: string;
  config: Config;
  records: Records;
}) => {
  const visited = Object.keys(records || {}).includes(name);
  if (visited) return true;

  const next = getNextStepName({ records, config }) === name;
  if (next) return true;

  return false;
};
