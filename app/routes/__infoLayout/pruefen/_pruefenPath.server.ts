import { testFeaturesEnabled } from "~/util/testFeaturesEnabled";

export const PRUEFEN_PREFIX = "pruefen";
export const PRUEFEN_START_STEP = testFeaturesEnabled()
  ? "bundesland"
  : "start";

export const PRUEFEN_START_PATH =
  "/" + PRUEFEN_PREFIX + "/" + PRUEFEN_START_STEP;
