import { ActionFunction, Form, LoaderFunction, redirect } from "remix";
import { createMachine, assign } from "xstate";

import { getFormDataCookie, createResponseHeaders } from "~/cookies";
import GrundDataModel, { StepFormData } from "~/domain/model";
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

export const loader: LoaderFunction = async ({ params, request }) => {
  console.log("LOADER", params);
  const cookie = await getFormDataCookie(request);

  const resourceId = new URL(request.url).searchParams.get("id");

  const machine = createMachine(getMachineConfig(cookie.records) as any, {
    guards: conditions,
  });
  // TODO: add context
  // idea: use "withContext" to add context to the machine
  // the context can than be used by the guard conditions
  // https://xstate.js.org/docs/guides/machines.html#initial-context

  const currentState = getCurrentState(request);
  console.log({ currentState });
  const currentStateWithoutId = currentState.replace(/\.\d+\./g, ".");

  // some pseudo/example code how this might work
  // I can get a specific state with "getStateNodeByPath" and access parents from there
  const currentStateNode = machine.getStateNodeByPath(currentStateWithoutId);
  if (currentStateNode.meta?.visibilityCond) {
    // this just checks for presence of that condition, but doesn't execute it, needs some more thought
    throw new Error("NONO");
  }

  // TODO: access control
  // idea: machine -> go to currentState -> check that state and all parents for visibilityConditions
  // if one says no, we don't allow access to this step

  const cookieData = new GrundDataModel(cookie.records);
  console.log(cookieData.serialize());
  const formData = cookieData.getStepData(currentState);
  return {
    formData,
    resourceId,
    i18n: (await i18n.getFixedT("de", "common"))(currentState),
  };
};

export const action: ActionFunction = async ({ params, request }) => {
  console.log("ACTION");
  const cookie = await getFormDataCookie(request);

  const currentState = getCurrentState(request);
  console.log({ currentState });
  const fieldValues: StepFormData = Object.fromEntries(
    await request.formData()
  ) as StepFormData;

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

  // Add data to bigger model
  const completeDataModel = new GrundDataModel(cookie.records);
  completeDataModel.setStepData(currentState, fieldValues);

  // Add bigger model to cookie
  cookie.records = completeDataModel.sections;

  // cookie.allowedSteps = cookie.allowedSteps || [];
  // cookie.allowedSteps.push(nextStepName as string);

  const machineWithData = machineWithoutData.withContext({
    ...cookie.records,
    currentId: params.id,
  });

  console.log({ currentState });

  const nextState = machineWithData.transition(currentStateWithoutId, {
    type: "NEXT",
  });
  console.log(nextState.value, nextState.context);

  let redirectUrl = `/steps/${nextState
    .toStrings()
    .at(-1)
    ?.split(".")
    .join("/")}`;

  if (nextState.matches("repeated.item")) {
    redirectUrl = redirectUrl.replace(
      "item/",
      `item/${(nextState.context as StateMachineContext).currentId || 1}/`
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
