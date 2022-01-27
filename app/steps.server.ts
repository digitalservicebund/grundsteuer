import { createMachine } from "xstate";

export const machine = createMachine({
  id: "multiStepForm",
  initial: "step1",
  states: {
    step1: {
      on: {
        STREET_NUMBER_EVEN: {
          target: "overview",
        },
        STREET_NUMBER_UNEVEN: {
          target: "step2",
        },
      },
    },
    step2: {
      onDone: {
        target: "overview",
      },
    },
    overview: { type: "final" },
  },
});
