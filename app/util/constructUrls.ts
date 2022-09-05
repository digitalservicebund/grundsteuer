import { StateMachineContext } from "~/domain/states/states.server";
import { State } from "xstate/lib/State";
import { EventObject, StateSchema, Typestate } from "xstate/lib/types";
import invariant from "tiny-invariant";
import { PruefenMachineContext } from "~/domain/pruefen/states.server";
import { StateMachine } from "xstate";

export const getBackUrl = ({
  machine,
  currentStateWithoutId,
  prefix,
}: {
  machine: StateMachine<any, StateSchema, EventObject>;
  currentStateWithoutId: string;
  prefix: string;
}) => {
  const backState = machine.transition(currentStateWithoutId, {
    type: "BACK",
  });
  const dotNotation = backState.toStrings().at(-1);
  invariant(dotNotation, "Should return a back state");
  if (
    dotNotation === currentStateWithoutId &&
    currentStateWithoutId !== "grundstueck.flurstueck.angaben"
  ) {
    return null;
  }
  let backUrl = `/${prefix}/${dotNotation.split(".").join("/")}`;
  if (backState.matches("eigentuemer.person")) {
    backUrl = backUrl.replace(
      "person/",
      `person/${(backState.context as StateMachineContext).personId || 1}/`
    );
  } else if (backState.matches("grundstueck.flurstueck")) {
    backUrl = backUrl.replace(
      "flurstueck/",
      `flurstueck/${
        (backState.context as StateMachineContext).flurstueckId || 1
      }/`
    );
  }
  return backUrl;
};

export const getRedirectUrl = (
  state: State<
    StateMachineContext | PruefenMachineContext,
    EventObject,
    StateSchema,
    Typestate<any>,
    any
  >,
  prefix: string,
  searchParams?: URLSearchParams
): string => {
  let redirectUrl = `/${prefix}/${state
    .toStrings()
    .at(-1)
    ?.split(".")
    .join("/")}`;
  if (state.matches("eigentuemer.person")) {
    redirectUrl = redirectUrl.replace(
      "person/",
      `person/${"personId" in state.context ? state.context.personId || 1 : 1}/`
    );
  } else if (state.matches("grundstueck.flurstueck")) {
    redirectUrl = redirectUrl.replace(
      "flurstueck/",
      `flurstueck/${
        "flurstueckId" in state.context ? state.context.flurstueckId || 1 : 1
      }/`
    );
  }
  return searchParams
    ? redirectUrl + "?" + searchParams.toString()
    : redirectUrl;
};
