import { Factory } from "fishery";
import type { Config } from "~/stepConfig";

export default Factory.define<Config>(() => ({
  steps: [],
}));
