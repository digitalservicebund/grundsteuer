import { Factory } from "fishery";
import type { Config } from "~/domain/config";

export default Factory.define<Config>(() => ({
  steps: [],
}));
