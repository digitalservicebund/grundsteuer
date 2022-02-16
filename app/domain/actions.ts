import { assign } from "xstate";
import { StateMachineContext } from "~/domain/steps";

export const actions = {
  incrementCurrentId: assign({
    currentId: (context) => {
      return ((context as StateMachineContext).currentId || 1) + 1;
    },
  }),
};
