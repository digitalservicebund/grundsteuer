import { getNextStepName, finalStepName } from "./getNextStepName";
import configFactory from "test/factories/config";
import configStepFactory from "test/factories/configStep";

const configStep = configStepFactory.build();
const configStepWithUnfulfillableCondition = configStepFactory.build({
  condition: () => false,
});
const configStepWithAlwaysFulfilledCondition = configStepFactory.build({
  condition: () => true,
});

describe("getNextStepName", () => {
  describe("without records", () => {
    const records = undefined;
    test("returns the first step", () => {
      expect(
        getNextStepName({
          config: configFactory.build({
            steps: [configStep],
          }),
          records,
        })
      ).toBe(configStep.name);
    });

    test("returns step with fulfilled condition", () => {
      expect(
        getNextStepName({
          config: configFactory.build({
            steps: [configStepWithAlwaysFulfilledCondition],
          }),
          records,
        })
      ).toBe(configStepWithAlwaysFulfilledCondition.name);
    });

    test("skips step with unfulfillable condition", () => {
      expect(
        getNextStepName({
          config: configFactory.build({
            steps: [configStepWithUnfulfillableCondition, configStep],
          }),
          records,
        })
      ).toBe(configStep.name);
    });

    test("returns final step when no steps found", () => {
      expect(
        getNextStepName({
          config: configFactory.build({
            steps: [],
          }),
          records,
        })
      ).toBe(finalStepName);
    });
  });

  describe("with records", () => {
    const records = { [configStep.name]: {} };

    test("skips the step from the records", () => {
      expect(
        getNextStepName({
          config: configFactory.build({
            steps: [configStep, configStepWithAlwaysFulfilledCondition],
          }),
          records,
        })
      ).toBe(configStepWithAlwaysFulfilledCondition.name);
    });
  });
});
