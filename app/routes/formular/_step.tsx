import {
  ActionFunction,
  Form,
  LoaderFunction,
  redirect,
  Link,
  useActionData,
  useLoaderData,
} from "remix";
import { createMachine } from "xstate";
import _ from "lodash";
import { Button } from "@digitalservice4germany/digital-service-library";
import { getFormDataCookie, createResponseHeaders } from "~/cookies";
import { i18Next } from "~/i18n.server";
import { getStepData, setStepData, StepFormData } from "~/domain/model";
import { getMachineConfig, StateMachineContext } from "~/domain/states";
import { conditions } from "~/domain/guards";
import { validateField } from "~/domain/validation";
import { actions } from "~/domain/actions";
import stepComponents, { FallbackStepComponent } from "~/components/steps";
import { getStepDefinition, GrundModel } from "~/domain/steps";
import { getCurrentStateFromUrl } from "~/util/getCurrentState";
import { State } from "xstate/lib/State";
import { StateSchema, Typestate } from "xstate/lib/types";
import { TypegenDisabled, TypegenMeta } from "xstate/lib/typegenTypes";

const getCurrentStateWithoutId = (currentState: string) => {
  return currentState.replace(/\.\d+\./g, ".");
};

const getMachine = ({ cookie, params }: any) => {
  const machineContext = { ...cookie.records } as StateMachineContext;
  if (params.personId) {
    machineContext.personId = parseInt(params.personId);
  } else if (params.flurstueckId) {
    machineContext.flurstueckId = parseInt(params.flurstueckId);
  }

  return createMachine(getMachineConfig(machineContext), {
    guards: conditions,
    actions: actions,
  });
};

const getBackUrl = ({ machine, currentStateWithoutId }: any) => {
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
  let backUrl = `/formular/${dotNotation.split(".").join("/")}`;
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

const getRedirectUrl = (
  state: State<
    StateMachineContext,
    Event,
    StateSchema,
    Typestate<StateMachineContext>,
    any
  >
): string => {
  let redirectUrl = `/formular/${state
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

export type I18nObject = {
  headline: string;
  fields: {
    [index: string]: {
      label: string;
      options?: Record<string, string>;
    };
  };
  specifics: Record<string, string>;
  common: Record<string, string>;
};

export type LoaderData = {
  formData: Record<string, any>;
  allData: GrundModel;
  i18n: I18nObject;
  backUrl: string | null;
  currentStateWithoutId: string;
  stepDefinition: {
    fields: Record<string, any>;
  };
};

export const loader: LoaderFunction = async ({
  params,
  request,
}): Promise<LoaderData | Response> => {
  const cookie = await getFormDataCookie(request);
  const currentState = getCurrentStateFromUrl(request.url);
  const currentStateWithoutId = getCurrentStateWithoutId(currentState);

  const machine = getMachine({ cookie, params });
  const stateNodeType = machine.getStateNodeByPath(currentStateWithoutId).type;
  if (stateNodeType == "compound") {
    const inititalState = machine.transition(currentStateWithoutId, "FAKE");
    const redirectUrl = getRedirectUrl(inititalState);
    const responseHeader: Headers = await createResponseHeaders(cookie);
    return redirect(redirectUrl, {
      headers: responseHeader,
    });
  }
  const backUrl = getBackUrl({ machine, currentStateWithoutId });
  const stepDefinition = getStepDefinition({ currentStateWithoutId });

  const tFunction = await i18Next.getFixedT("de", "all");
  return {
    formData: getStepData(cookie.records, currentState),
    allData: cookie.records,
    i18n: {
      ...tFunction(currentStateWithoutId, {
        id: params?.id ? parseInt(params.id) : undefined,
      }),
      common: { ...tFunction("common") },
    },
    backUrl,
    currentStateWithoutId,
    stepDefinition,
  };
};

type ActionData = {
  errors: Record<string, Array<string>>;
};

export const action: ActionFunction = async ({ params, request }) => {
  const cookie = await getFormDataCookie(request);
  if (!cookie.records) cookie.records = {};

  const currentState = getCurrentStateFromUrl(request.url);
  const currentStateWithoutId = getCurrentStateWithoutId(currentState);

  const fieldValues = Object.fromEntries(
    await request.formData()
  ) as unknown as StepFormData;

  // validate
  const errors: Record<string, Array<string>> = {};
  const stepDefinition = getStepDefinition({ currentStateWithoutId });
  if (stepDefinition) {
    Object.entries(stepDefinition.fields).forEach(
      ([name, field]: [string, any]) => {
        const fieldErrorMessages = validateField(name, field, fieldValues);
        if (fieldErrorMessages.length > 0) errors[name] = fieldErrorMessages;
      }
    );
  }
  if (Object.keys(errors).length >= 1) return { errors } as ActionData;

  // store
  cookie.records = setStepData(cookie.records, currentState, fieldValues);

  // redirect
  const machine = getMachine({ cookie, params });
  const nextState = machine.transition(currentStateWithoutId, {
    type: "NEXT",
  });
  const redirectUrl = getRedirectUrl(nextState);
  const responseHeader: Headers = await createResponseHeaders(cookie);
  return redirect(redirectUrl, {
    headers: responseHeader,
  });
};

export type StepComponentFunction = (
  props: LoaderData & ActionData
) => JSX.Element;

export function Step() {
  const loaderData = useLoaderData();
  const actionData = useActionData() as ActionData;
  const { i18n, backUrl, currentStateWithoutId } = loaderData;
  const StepComponent =
    _.get(stepComponents, currentStateWithoutId) || FallbackStepComponent;

  return (
    <div className="p-8">
      <h1 className="mb-8 font-bold text-4xl">{i18n.headline}</h1>
      {actionData?.errors ? "ERRORS: " + JSON.stringify(actionData.errors) : ""}
      <Form method="post" className="mb-16">
        <StepComponent {...loaderData} {...actionData} />
        <div className="flex flex-row-reverse items-center justify-between">
          <Button id="nextButton">{i18n.common.continue}</Button>
          {backUrl ? <Link to={backUrl}>{i18n.common.back}</Link> : ""}
        </div>
      </Form>
    </div>
  );
}
