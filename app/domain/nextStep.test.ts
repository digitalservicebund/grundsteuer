import { nextStep, finalStepName } from "./nextStep";
import configFactory from "test/factories/stepConfig";
import configStepFactory from "test/factories/configStep";

const configStep = configStepFactory.build();
const configStepWithUnfulfillableCondition = configStepFactory.build({
  condition: () => false,
});
const configStepWithAlwaysFulfilledCondition = configStepFactory.build({
  condition: () => true,
});

describe("nextStep", () => {
  describe("without records", () => {
    const records = undefined;
    test("returns the first step", () => {
      expect(
        nextStep({
          config: configFactory.build({
            steps: [configStep],
          }),
          records,
        })
      ).toBe(configStep.name);
    });

    test("returns step with fulfilled condition", () => {
      expect(
        nextStep({
          config: configFactory.build({
            steps: [configStepWithAlwaysFulfilledCondition],
          }),
          records,
        })
      ).toBe(configStepWithAlwaysFulfilledCondition.name);
    });

    test("skips step with unfulfillable condition", () => {
      expect(
        nextStep({
          config: configFactory.build({
            steps: [configStepWithUnfulfillableCondition, configStep],
          }),
          records,
        })
      ).toBe(configStep.name);
    });

    test("returns final step when no steps found", () => {
      expect(
        nextStep({
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
        nextStep({
          config: configFactory.build({
            steps: [configStep, configStepWithAlwaysFulfilledCondition],
          }),
          records,
        })
      ).toBe(configStepWithAlwaysFulfilledCondition.name);
    });
  });
});
