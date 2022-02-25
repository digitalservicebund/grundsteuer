import { assign } from "xstate";
import { StateMachineContext } from "~/domain/states";

export const actions = {
  incrementCurrentId: assign({
    currentId: (context) => {
      return ((context as StateMachineContext).currentId || 1) + 1;
    },
  }),
  decrementCurrentId: assign({
    currentId: (context) => {
      return ((context as StateMachineContext).currentId || 2) - 1;
    },
  }),
  setCurrentIdToMaximum: assign({
    currentId: (context) => {
      return (context as StateMachineContext)?.eigentuemer?.anzahl?.anzahl || 1;
    },
  }),
};
