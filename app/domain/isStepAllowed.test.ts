import { faker } from "@faker-js/faker";
import { isStepAllowed } from "./isStepAllowed";
import configFactory from "test/factories/config";
import configStepFactory from "test/factories/configStep";

const configStep = configStepFactory.build();
const config = configFactory.build({ steps: [configStep] });

describe("isStepAllowed", () => {
  test("returns false by default", () => {
    expect(
      isStepAllowed({
        name: faker.random.word(),
        config,
        records: {},
      })
    ).toBe(false);
  });

  test("returns true if given step was already visited before", () => {
    expect(
      isStepAllowed({
        name: configStep.name,
        config,
        records: {
          [configStep.name]: {},
        },
      })
    ).toBe(true);
  });

  test("returns true if given step is the next planned step", () => {
    expect(
      isStepAllowed({
        name: configStep.name,
        config,
        records: {},
      })
    ).toBe(true);
  });
});
