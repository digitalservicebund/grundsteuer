import { createMachine, interpret } from "xstate";
import { GrundDataModelData } from "~/domain/model";
import { getMachineConfig } from "./steps";

const isBebaut = (context: GrundDataModelData) => {
  return context?.sectionGrundstueck?.bebauung.bebauung === "bebaut";
};

export const getNextStepName = ({
  currentStepName,
  records,
}: {
  currentStepName: string;
  records: GrundDataModelData;
}) => {
  const machine = createMachine(getMachineConfig(records) as any, {
    guards: {
      isBebaut,
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
