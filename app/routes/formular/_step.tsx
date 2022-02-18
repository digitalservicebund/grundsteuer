import { ActionFunction, Form, LoaderFunction, redirect } from "remix";
import { createMachine } from "xstate";
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
  return `/formular/${dotNotation.split(".").join("/")}`;
};

export const loader: LoaderFunction = async ({ params, request }) => {
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
    i18n: (await i18n.getFixedT("de", "common"))(currentStateWithoutId),
    backUrl,
  };
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
  if (Object.keys(errors).length >= 1) return { errors };

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

export function render(
  actionData: any,
  headline: string,
  stepForm: JSX.Element
) {
  return (
    <div className="p-8">
      <div className="bg-beige-100 h-full p-4">
        <h1 className="mb-8 font-bold text-4xl">{headline}</h1>
        {actionData?.errors
          ? "ERRORS: " + JSON.stringify(actionData.errors)
          : ""}
        <Form method="post" className="mb-16">
          {stepForm}
          <Button id="nextButton">Weiter</Button>
        </Form>
      </div>
    </div>
  );
}
