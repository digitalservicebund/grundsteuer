import { ActionFunction, Form, LoaderFunction, redirect } from "remix";
import { createMachine } from "xstate";

import { getFormDataCookie, createResponseHeaders } from "~/cookies";
import {
  getStepData,
  setStepData,
  StepFormData,
  defaults,
} from "~/domain/model";
import { getMachineConfig, StateMachineContext } from "~/domain/steps";
import { conditions } from "~/domain/conditions";
import { validateField } from "~/domain/validation";
import { ConfigStepField } from "~/domain";
import { Button } from "@digitalservice4germany/digital-service-library";
import { i18n } from "~/i18n.server";
import { actions } from "~/domain/actions";

export function getCurrentState(request: Request) {
  return new URL(request.url).pathname
    .split("/")
    .filter((e) => e && e !== "steps")
    .join(".");
}

export const loader: LoaderFunction = async ({ request }) => {
  const cookie = await getFormDataCookie(request);
  const currentState = getCurrentState(request);
  const currentStateWithoutId = currentState.replace(/\.\d+\./g, ".");

  return {
    formData: getStepData(
      Object.keys(cookie).length < 1 ? defaults : cookie.records,
      currentState
    ),
    i18n: (await i18n.getFixedT("de", "common"))(currentStateWithoutId),
  };
};

export const action: ActionFunction = async ({ params, request }) => {
  const cookie = await getFormDataCookie(request);

  if (!cookie.records) {
    cookie.records = defaults;
  }

  const currentState = getCurrentState(request);
  console.log({ currentState });
  const fieldValues = Object.fromEntries(
    await request.formData()
  ) as unknown as StepFormData;
  console.log({ fieldValues });

  const machineWithoutData = createMachine(getMachineConfig(null) as any, {
    guards: conditions,
    actions: actions,
  });

  const currentStateWithoutId = currentState.replace(/\.\d+\./g, ".");

  const errors: Record<string, Array<string>> = {};
  const state = machineWithoutData.getStateNodeByPath(currentStateWithoutId);
  state.meta?.stepDefinition?.fields.forEach((field: ConfigStepField) => {
    const fieldErrorMessages = validateField(field, fieldValues);
    if (fieldErrorMessages.length > 0) errors[field.name] = fieldErrorMessages;
  });
  if (Object.keys(errors).length >= 1) return { errors };

  cookie.records = setStepData(cookie.records, currentState, fieldValues);

  const machineWithData = machineWithoutData.withContext({
    ...cookie.records,
    currentId: params.id ? parseInt(params.id) : null,
  });

  console.log({ currentState });

  const nextState = machineWithData.transition(currentStateWithoutId, {
    type: "NEXT",
  });
  console.log(nextState.value);

  let redirectUrl = `/steps/${nextState
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
  console.log({ redirectUrl });

  const responseHeader: Headers = await createResponseHeaders(cookie);
  return redirect(redirectUrl, {
    headers: responseHeader,
  });
};

// this will activate showing the form navigation in root.tsx
export const handle = {
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
          <Button>Weiter</Button>
        </Form>
      </div>
    </div>
  );
}
