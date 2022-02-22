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
import { i18n } from "~/i18n.server";
import {
  getStepData,
  setStepData,
  StepFormData,
  defaults,
} from "~/domain/model";
import { getMachineConfig, StateMachineContext } from "~/domain/states";
import { conditions } from "~/domain/guards";
import { validateField } from "~/domain/validation";
import { ConfigStepField } from "~/domain";
import { actions } from "~/domain/actions";
import { Handle } from "~/components/SidebarNavigation";
import stepComponents, { FallbackStepComponent } from "~/components/steps";

const getCurrentState = (request: Request) => {
  return new URL(request.url).pathname
    .split("/")
    .filter((e) => e && e !== "formular")
    .join(".");
};

const getCurrentStateWithoutId = (currentState: string) => {
  return currentState.replace(/\.\d+\./g, ".");
};

const getMachine = ({ cookie, params }: any) => {
  const machineContext = { ...cookie.records } as StateMachineContext;
  if (params.id) {
    machineContext.currentId = parseInt(params.id);
  }
  const machine = createMachine(getMachineConfig(machineContext) as any, {
    guards: conditions,
    actions: actions,
  });
  return machine;
};

const getBackUrl = ({ machine, currentStateWithoutId }: any) => {
  const backState = machine.transition(currentStateWithoutId, {
    type: "BACK",
  });
  const dotNotation = backState.toStrings().at(-1);
  if (dotNotation === currentStateWithoutId) {
    return null;
  }
  let backUrl = `/formular/${dotNotation.split(".").join("/")}`;
  if (backState.matches("eigentuemer.person")) {
    backUrl = backUrl.replace(
      "person/",
      `person/${(backState.context as StateMachineContext).currentId || 1}/`
    );
  }
  return backUrl;
};

type LoaderData = {
  formData: Record<string, any>;
  i18n: Record<string, any>;
  backUrl: string | null;
  currentStateWithoutId: string;
};

export const loader: LoaderFunction = async ({
  params,
  request,
}): Promise<LoaderData> => {
  const cookie = await getFormDataCookie(request);
  const currentState = getCurrentState(request);
  const currentStateWithoutId = getCurrentStateWithoutId(currentState);

  const machine = getMachine({ cookie, params });
  const backUrl = getBackUrl({ machine, currentStateWithoutId });

  return {
    formData: getStepData(
      Object.keys(cookie).length < 1 ? defaults : cookie.records,
      currentState
    ),
    i18n: (await i18n.getFixedT("de", "common"))(currentStateWithoutId, {
      id: params?.id ? parseInt(params.id) : undefined,
    }),
    backUrl,
    currentStateWithoutId,
  };
};

type ActionData = {
  errors: Record<string, Array<string>>;
};

export const action: ActionFunction = async ({ params, request }) => {
  const cookie = await getFormDataCookie(request);
  if (!cookie.records) cookie.records = defaults;

  const currentState = getCurrentState(request);
  const currentStateWithoutId = getCurrentStateWithoutId(currentState);

  const fieldValues = Object.fromEntries(
    await request.formData()
  ) as unknown as StepFormData;

  const machine = getMachine({ cookie, params });

  // validate
  const errors: Record<string, Array<string>> = {};
  const stateNode = machine.getStateNodeByPath(currentStateWithoutId);
  stateNode.meta?.stepDefinition?.fields.forEach((field: ConfigStepField) => {
    const fieldErrorMessages = validateField(field, fieldValues);
    if (fieldErrorMessages.length > 0) errors[field.name] = fieldErrorMessages;
  });
  if (Object.keys(errors).length >= 1) return { errors } as ActionData;

  // store
  cookie.records = setStepData(cookie.records, currentState, fieldValues);

  // redirect
  const nextState = machine.transition(currentStateWithoutId, {
    type: "NEXT",
  });
  let redirectUrl = `/formular/${nextState
    .toStrings()
    .at(-1)
    ?.split(".")
    .join("/")}`;
  if (nextState.matches("eigentuemer.person")) {
    redirectUrl = redirectUrl.replace(
      "person/",
      `person/${(nextState.context as StateMachineContext).currentId || 1}/`
    );
  }
  const responseHeader: Headers = await createResponseHeaders(cookie);
  return redirect(redirectUrl, {
    headers: responseHeader,
  });
};

// this will activate showing the form navigation in root.tsx
export const handle: Handle = {
  showFormNavigation: true,
};

export type StepComponentFunction = (
  props: LoaderData & ActionData
) => JSX.Element;

export function Step() {
  const loaderData = useLoaderData() as LoaderData;
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
        {backUrl ? <Link to={backUrl}>Zurück</Link> : ""}
        <Button id="nextButton">Weiter</Button>
      </Form>
    </div>
  );
}
