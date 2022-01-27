import { createMachine } from "xstate";

export const machine = createMachine(
  {
    id: "multiStepForm",
    initial: "step1",
    states: {
      step1: {
        initial: "input",
        id: "step1",
        on: {
          STREET_NUMBER_EVEN: {
            target: "overview",
          },
          STREET_NUMBER_UNEVEN: {
            target: "step2",
          },
        },
        states: {
          input: {
            on: { VALIDATE: { target: "validating" } },
          },
          validating: {
            invoke: {
              src: "validateStep1FormData",
              onDone: {
                target: "saving",
              },
              onError: {
                target: "input",
              },
            },
          },
          saving: {
            invoke: {
              src: "saveStep1FormData",
              onDone: {
                target: "complete",
              },
              onError: {
                target: "input",
              },
            },
          },
          complete: { type: "final" },
        },
      },
      step2: {
        id: "step2",
        initial: "input",
        onDone: {
          target: "overview",
        },
        states: {
          input: {
            on: { VALIDATE: { target: "validating" } },
          },
          validating: {
            invoke: {
              src: "validateStep2FormData",
              onDone: {
                target: "saving",
              },
              onError: {
                target: "input",
              },
            },
          },
          saving: {
            invoke: {
              src: "saveStep2FormData",
              onDone: {
                target: "complete",
              },
              onError: {
                target: "input",
              },
            },
          },
          complete: { type: "final" },
        },
      },
      overview: { type: "final" },
    },
  },
  {
    services: {
      validateStep1FormData: (context, event) => Promise.resolve(true),
      validateStep2FormData: (context, event) => Promise.resolve(true),
      saveStep1FormData: (context, event) => Promise.resolve(true),
      saveStep2FormData: (context, event) => Promise.resolve(true),
    },
  }
);
