import {
  useLoaderData,
  useActionData,
  ActionFunction,
  LoaderFunction,
  redirect,
  Form,
} from "remix";
import invariant from "tiny-invariant";
import { createMachine } from "xstate";
import { Button } from "@digitalservice4germany/digital-service-library";

import { getFormDataCookie, createResponseHeaders } from "~/cookies";
import { lookupStep } from "~/domain/steps/stepLookup";
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

  // if (
  //   !(
  //     stepConfig &&
  //     (params.stepName === "adresse" ||
  //       (cookie.allowedSteps && cookie.allowedSteps.includes(params.stepName)))
  //   )
  // ) {
  //   return redirect(
  //     `/steps/${getNextStepName({
  //       currentStepName: params.stepName,
  //       records: cookie.records,
  //     })}`
  //   );
  // }

  const cookieData = new GrundDataModel(cookie.records);
  const formData = cookieData.getStepData(currentState);
  return { cookie, formData, params, resourceId, currentState };
};

export const action: ActionFunction = async ({ params, request }) => {
  console.log("ACTION");
  invariant(params.stepName, "Expected stepName");
  // const stepConfig = getStepConfig(params.stepName);
  // invariant(stepConfig, "Expected stepConfig");
  const cookie = await getFormDataCookie(request);

  const formData: FormData = await request.formData();

  // Parse sent data into step-model
  const step = lookupStep(params.stepName);
  if (step) {
    invariant(step.dataModel, "Expected dataModel");
    const stepDataModel = new step.dataModel(formData);
    // validate step-model
    // TODO validate stepDtaModel
    // Add data to bigger model
    const completeDataModel = new GrundDataModel(cookie.records);
    completeDataModel.addStepData(params.stepName, stepDataModel);

    // Add bigger model to cookie
    cookie.records = completeDataModel.sections;
  }

  // cookie.allowedSteps = cookie.allowedSteps || [];
  // cookie.allowedSteps.push(nextStepName as string);

  const machine = createMachine(getMachineConfig(cookie.records) as any, {
    guards: conditions,
  });

  // TODO: improve cheap url -> state conversion
  const currentState = getCurrentState(request);
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

export function Step() {
  const { stepName, cookie, formData, params, resourceId, currentState } =
    useLoaderData();
  const actionData = useActionData();

  const step = lookupStep(stepName);
  return (
    <div className="p-8">
      <pre>{JSON.stringify({ params }, null, 2)}</pre>
      <pre>{JSON.stringify({ resourceId }, null, 2)}</pre>
      <pre>{JSON.stringify({ currentState }, null, 2)}</pre>

      {step ? (
        step.render(cookie, formData, actionData)
      ) : (
        <Form method="post">
          <Button>NEXT</Button>
        </Form>
      )}
    </div>
  );
}
