import { ActionFunction, LoaderFunction, redirect } from "remix";
import invariant from "tiny-invariant";
import { createMachine } from "xstate";

import { getFormDataCookie, createResponseHeaders } from "~/cookies";
import GrundDataModel from "~/domain/model";
import { getMachineConfig } from "~/domain/steps";
import { conditions } from "~/domain/conditions";

function getCurrentState(request: Request) {
  return new URL(request.url).pathname
    .split("/")
    .filter((e) => e && e !== "steps")
    .join(".");
}

export const loader: LoaderFunction = async ({ params, request }) => {
  console.log("LOADER", params);
  const cookie = await getFormDataCookie(request);

  const resourceId = new URL(request.url);

  const machine = createMachine(getMachineConfig(cookie.records) as any, {
    guards: conditions,
  });
  // TODO: add context
  // idea: use "withContext" to add context to the machine
  // the context can than be used by the guard conditions
  // https://xstate.js.org/docs/guides/machines.html#initial-context

  const currentState = getCurrentState(request);

  // some pseudo/example code how this might work
  // I can get a specific state with "getStateNodeByPath" and access parents from there
  const currentStateNode = machine.getStateNodeByPath(currentState);
  if (currentStateNode.meta?.visibilityCond) {
    // this just checks for presence of that condition, but doesn't execute it, needs some more thought
    throw new Error("NONO");
  }

  // TODO: access control
  // idea: machine -> go to currentState -> check that state and all parents for visibilityConditions
  // if one says no, we don't allow access to this step

  const cookieData = new GrundDataModel(cookie.records);
  const formData = cookieData.getStepData(currentState);
  return { formData, resourceId };
};

export const action: ActionFunction = async ({ request }) => {
  console.log("ACTION");
  const cookie = await getFormDataCookie(request);

  const currentState = getCurrentState(request);

  const formData: FormData = await request.formData();
  const fieldValues = Object.fromEntries(formData);
  const stepName = formData.get("stepName") as string;
  invariant(stepName, "Expected stepName");

  // validate step-model
  // TODO validate stepDtaModel
  // Add data to bigger model
  const completeDataModel = new GrundDataModel(cookie.records);
  completeDataModel.setStepData(currentState, fieldValues);

  // Add bigger model to cookie
  cookie.records = completeDataModel.sections;

  // cookie.allowedSteps = cookie.allowedSteps || [];
  // cookie.allowedSteps.push(nextStepName as string);

  const machine = createMachine(getMachineConfig(cookie.records) as any, {
    guards: conditions,
  });

  // TODO: improve cheap url -> state conversion
  console.log({ currentState });

  const nextState = machine.transition(currentState, {
    type: "NEXT",
  }).value;
  console.log({ nextState });

  const redirectUrl =
    "/steps/" +
    JSON.stringify(nextState).replace(/:/g, "/").replace(/[{}"]/g, "");
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
        {actionData?.errors ? "ERRORS: " + actionData.errors : ""}
        {stepForm}
      </div>
    </div>
  );
}
