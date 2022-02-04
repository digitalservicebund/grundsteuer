import { createMachine, interpret } from "xstate";
import type { Records } from "~/domain/records";

const isBebaut = (context: any, event: any) => {
  return context.bebauung.bebauung === "bebaut";
};

export const getNextStepName = ({
  currentStepName,
  records,
}: {
  currentStepName: string;
  records: Records;
}) => {
  const machine = createMachine({
    id: "machine",
    initial: "adresse",
    context: records,
    states: {
      adresse: {
        on: {
          NEXT: [
            {
              target: "bebauung",
            },
          ],
        },
      },
      bebauung: {
        on: {
          NEXT: [
            {
              target: "gebaeude",
              cond: isBebaut,
            },
            {
              target: "zusammenfassung",
            },
          ],
        },
      },
      gebaeude: {
        on: {
          NEXT: [
            {
              target: "zusammenfassung",
            },
          ],
        },
      },
      zusammenfassung: { type: "final" },
    },
  });

  const service = interpret(machine)
    .onTransition((state) => console.log("Transition: ", state.value))
    .start(currentStepName);

  const nextState = service.send({
    type: "NEXT",
    query: records,
  });

  return nextState.value;
};
