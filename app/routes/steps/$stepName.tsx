import {
  useLoaderData,
  useActionData,
  ActionFunction,
  LoaderFunction,
  redirect,
} from "remix";
import invariant from "tiny-invariant";

import { config, getNextStepName } from "~/domain";
import { getFormDataCookie, createResponseHeaders } from "~/cookies";
import { lookupStep } from "~/steps/stepLookup";

const getStepConfig = (stepName: string) => {
  const stepConfig = config.steps.find(({ name }) => name === stepName);
  console.log(stepConfig);
  return stepConfig;
};

export const loader: LoaderFunction = async ({ params, request }) => {
  invariant(params.stepName, "Expected stepName");
  const stepConfig = getStepConfig(params.stepName);
  const cookie = await getFormDataCookie(request);

  if (
    !(
      stepConfig &&
      (params.stepName === "adresse" ||
        (cookie.allowedSteps && cookie.allowedSteps.includes(params.stepName)))
    )
  ) {
    return redirect(
      `/steps/${getNextStepName({
        currentStepName: params.stepName,
        records: cookie.records,
      })}`
    );
  }

  const formData = cookie.records?.[params.stepName];
  const stepName = params.stepName;
  return { stepName, cookie, formData };
};

export const action: ActionFunction = async ({ params, request }) => {
  invariant(params.stepName, "Expected stepName");
  const stepConfig = getStepConfig(params.stepName);
  invariant(stepConfig, "Expected stepConfig");
  const cookie = await getFormDataCookie(request);

  const formData: FormData = await request.formData();

  cookie.records = cookie.records || {};
  cookie.records[params.stepName] = stepConfig.fields
    .map((field) => field.name)
    .reduce((acc, name) => {
      return Object.assign(acc, { [name]: formData.get(name) });
    }, {});

  const nextStepName = getNextStepName({
    currentStepName: params.stepName,
    records: cookie.records,
  });

  cookie.allowedSteps = cookie.allowedSteps || [];
  cookie.allowedSteps.push(nextStepName as string);

  const responseHeader: Headers = await createResponseHeaders(cookie);
  return redirect(`/steps/${nextStepName}`, {
    headers: responseHeader,
  });
};

export default function FormularStep() {
  const { stepName, cookie, formData } = useLoaderData();
  const actionData = useActionData();

  const step = lookupStep(stepName);
  return new step().render(cookie, formData, actionData);
}
