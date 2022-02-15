import {
  ActionFunction,
  Form,
  redirect,
  useActionData,
  useLoaderData,
} from "remix";
import { Button } from "@digitalservice4germany/digital-service-library";
import { ConfigStepField, ConfigStepFieldValidation } from "~/domain";
import { StepTextField } from "~/components";
import { getCurrentState, render } from "~/routes/steps/_step";
import { createResponseHeaders, getFormDataCookie } from "~/cookies";
import GrundDataModel, { StepFormData } from "~/domain/model";
import { createMachine } from "xstate";
import { getMachineConfig, getStateNodeByPath } from "~/domain/steps";
import { conditions } from "~/domain/conditions";
import { validateField } from "~/domain/validation";

export { loader, handle } from "./../../_step";

export const action: ActionFunction = async ({ request, params }) => {
  console.log("ACTION");
  const cookie = await getFormDataCookie(request);

  let currentState = getCurrentState(request);
  const fieldValues: StepFormData = Object.fromEntries(
    await request.formData()
  ) as StepFormData;

  // validate step-model
  const machineWithoutData = createMachine(getMachineConfig(null) as any, {
    guards: conditions,
  });

  const errors: Record<string, Array<string>> = {};
  const state = getStateNodeByPath(machineWithoutData, currentState);
  if (state?.meta?.stepDefinition) {
    state.meta.stepDefinition.fields.forEach(
      (field: ConfigStepFieldValidation) => {
        const fieldErrorMessages = validateField(field, fieldValues);
        if (fieldErrorMessages.length > 0)
          errors[field.name] = fieldErrorMessages;
      }
    );
    if (Object.keys(errors).length >= 1) return { errors };
  }

  // Add data to bigger model
  const completeDataModel = new GrundDataModel(cookie.records);
  completeDataModel.setStepData(currentState, fieldValues);

  // Add bigger model to cookie
  cookie.records = completeDataModel.sections;

  const machineWithData = machineWithoutData.withContext(cookie.records);

  completeDataModel.sections.repeated.currentIndex =
    params.id as unknown as number;
  currentState = currentState.replace(/\.\d+/, "");
  console.log(currentState);
  const nextState = machineWithData.transition(
    currentState,
    {
      type: "NEXT",
    },
    completeDataModel
  ).value;
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

export default function ItemName() {
  const { formData } = useLoaderData();
  const actionData = useActionData();

  const name: ConfigStepField = {
    name: "name",
    label: "Name",
  };

  return render(
    actionData,
    "Name des Items",

    <Form method="post" className="mb-16">
      <StepTextField config={name} value={formData?.[name.name]} />
      <input type="hidden" name="stepName" value="name" />
      <Button>Weiter</Button>
    </Form>
  );
}
