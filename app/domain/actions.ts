import { assign } from "xstate";
import { StateMachineContext } from "~/domain/states";

export const actions = {
  incrementCurrentId: assign({
    currentId: (context) => {
      return ((context as StateMachineContext).currentId || 1) + 1;
    },
  }),
};
