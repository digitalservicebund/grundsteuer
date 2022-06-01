import { StateMachineContext } from "~/domain/states";
import { State } from "xstate/lib/State";
import { StateSchema, Typestate } from "xstate/lib/types";

export const getBackUrl = ({
  machine,
  currentStateWithoutId,
  prefix,
}: {
  machine: any;
  currentStateWithoutId: string;
  prefix: string;
}) => {
  const backState = machine.transition(currentStateWithoutId, {
    type: "BACK",
  });
  const dotNotation = backState.toStrings().at(-1);
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
    StateMachineContext,
    Event,
    StateSchema,
    Typestate<StateMachineContext>,
    any
  >,
  prefix: string
): string => {
  let redirectUrl = `/${prefix}/${state
    .toStrings()
    .at(-1)
    ?.split(".")
    .join("/")}`;
  if (state.matches("eigentuemer.person")) {
    redirectUrl = redirectUrl.replace(
      "person/",
      `person/${state.context.personId || 1}/`
    );
  } else if (state.matches("grundstueck.flurstueck")) {
    redirectUrl = redirectUrl.replace(
      "flurstueck/",
      `flurstueck/${state.context.flurstueckId || 1}/`
    );
  }
  return redirectUrl;
};
