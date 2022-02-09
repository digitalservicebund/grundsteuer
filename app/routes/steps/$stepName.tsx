import {
  useLoaderData,
  useActionData,
  ActionFunction,
  LoaderFunction,
  redirect,
} from "remix";
import invariant from "tiny-invariant";

import { config, getNextStepName, Records } from "~/domain";
import { getFormDataCookie, createResponseHeaders } from "~/cookies";
import { lookupStep } from "~/steps/stepLookup";
import GrundDataModel, { GrundDataModelData } from "~/domain/model";
import BaseStep from "~/steps/baseStep";

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

  const cookieData = new GrundDataModel(cookie.records);
  const formData = cookieData.getStepData(params.stepName);
  const stepName = params.stepName;
  return { stepName, cookie, formData };
};

export const action: ActionFunction = async ({ params, request }) => {
  invariant(params.stepName, "Expected stepName");
  const stepConfig = getStepConfig(params.stepName);
  invariant(stepConfig, "Expected stepConfig");
  const cookie = await getFormDataCookie(request);

  const formData: FormData = await request.formData();

  // Parse sent data into step-model
  const step: BaseStep = lookupStep(params.stepName);
  invariant(step.dataModel, "Expected dataModel");
  const stepDataModel = new step.dataModel(formData);
  // validate step-model
  // TODO validate stepDtaModel
  // Add data to bigger model
  const completeDataModel = new GrundDataModel(cookie.records);
  completeDataModel.addStepData(params.stepName, stepDataModel);

  // Add bigger model to cookie
  cookie.records = completeDataModel.sections;

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
  return step.render(cookie, formData, actionData);
}
