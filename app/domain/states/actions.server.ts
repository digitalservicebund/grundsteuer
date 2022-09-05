import { assign } from "xstate";
import { StateMachineContext } from "~/domain/states/states.server";

export const actions = {
  incrementPersonId: assign({
    personId: (context) => {
      return ((context as StateMachineContext).personId || 1) + 1;
    },
  }),
  decrementPersonId: assign({
    personId: (context) => {
      return ((context as StateMachineContext).personId || 2) - 1;
    },
  }),
  setPersonIdToMaximum: assign({
    personId: (context) => {
      return (context as StateMachineContext)?.eigentuemer?.anzahl?.anzahl || 1;
    },
  }),
  incrementFlurstueckId: assign({
    flurstueckId: (context) => {
      return ((context as StateMachineContext).flurstueckId || 1) + 1;
    },
  }),
  decrementFlurstueckId: assign({
    flurstueckId: (context) => {
      return ((context as StateMachineContext).flurstueckId || 2) - 1;
    },
  }),
  setFlurstueckIdToMaximum: assign({
    flurstueckId: (context) => {
      return (context as StateMachineContext)?.grundstueck?.anzahl?.anzahl || 1;
    },
  }),
};
