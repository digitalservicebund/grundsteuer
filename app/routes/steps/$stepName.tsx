import { Button } from "@digitalservice4germany/digital-service-library";
import {
  useLoaderData,
  useActionData,
  Form,
  ActionFunction,
  LoaderFunction,
  redirect,
} from "remix";
import invariant from "tiny-invariant";

import { StepTextField, StepRadioField, StepSelectField } from "~/components";
import {
  config,
  ConfigStepField,
  FieldType,
  getNextStepName,
  isStepAllowed,
} from "~/domain";
import { getFormDataCookie, createResponseHeaders } from "~/cookies";

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
    !stepConfig ||
    !isStepAllowed({
      name: params.stepName,
      records: cookie.records,
      config,
    })
  ) {
    return redirect(
      `/steps/${getNextStepName({
        config,
        records: cookie.records,
      })}`
    );
  }

  const formData = cookie.records?.[params.stepName];
  return { stepConfig, cookie, formData };
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

  const responseHeader: Headers = await createResponseHeaders(cookie);
  return redirect(
    `/steps/${getNextStepName({
      config,
      records: cookie.records,
    })}`,
    {
      headers: responseHeader,
    }
  );
};

export default function FormularStep() {
  const { stepConfig, cookie, formData } = useLoaderData();
  const { headline, fields } = stepConfig;
  const actionData = useActionData();

  const renderField = (field: ConfigStepField) => {
    const { name, type } = field;
    return (
      <div key={name} className="mb-8">
        {type === FieldType.Text && (
          <StepTextField config={field} value={formData?.[name]} />
        )}
        {type === FieldType.Radio && (
          <StepRadioField config={field} value={formData?.[name]} />
        )}
        {type === FieldType.Select && (
          <StepSelectField config={field} value={formData?.[name]} />
        )}
      </div>
    );
  };

  return (
    <div className="bg-beige-100 h-full p-4">
      <h1 className="mb-8 font-bold text-4xl">{headline}</h1>
      {actionData?.errors ? "ERRORS: " + actionData.errors : ""}
      {fields && (
        <Form method="post" className="mb-16">
          {fields.map((field: ConfigStepField) => renderField(field))}
          <Button>Weiter</Button>
        </Form>
      )}
      <pre>stepConfig: {JSON.stringify(stepConfig, null, 2)}</pre>
      <pre>cookie: {JSON.stringify(cookie, null, 2)}</pre>
    </div>
  );
}
