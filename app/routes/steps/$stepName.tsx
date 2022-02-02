import {
  Input,
  Button,
  Label,
} from "@digitalservice4germany/digital-service-library";
import {
  useLoaderData,
  useActionData,
  Form,
  ActionFunction,
  LoaderFunction,
  redirect,
} from "remix";
import invariant from "tiny-invariant";
import config, { FieldType } from "~/domain/config";
import type {
  ConfigStepField,
  ConfigStepFieldText,
  ConfigStepFieldSelect,
  ConfigStepFieldRadio,
  ConfigStepFieldOptionsItem,
} from "~/domain/config";
import { getNextStepName } from "~/domain/getNextStepName";
import allowedStep from "~/domain/allowedStep";
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
    !config ||
    !allowedStep({
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
  return { config: stepConfig, cookie, formData };
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
  const { config, cookie, formData } = useLoaderData();
  const { headline, fields } = config;
  const actionData = useActionData();

  const renderRadioFieldOption = ({
    name,
    value,
    label,
  }: ConfigStepFieldOptionsItem & { name: string }) => {
    const id = `${name}-${value}`;
    const checked = formData && formData[name] === value;
    return (
      <div key={value}>
        <input
          defaultChecked={checked}
          type="radio"
          name={name}
          value={value}
          id={id}
        />
        <label htmlFor={id}>{label}</label>
      </div>
    );
  };

  const renderSelectFieldOption = ({
    name,
    value,
    label,
  }: ConfigStepFieldOptionsItem & { name: string }) => {
    return (
      <option value={value} key={value}>
        {label}
      </option>
    );
  };

  const renderRadioField = ({ name, label, options }: ConfigStepFieldRadio) => {
    return (
      <fieldset>
        <legend>{label}</legend>
        {options.map((item) =>
          renderRadioFieldOption({ name, value: item.value, label: item.label })
        )}
      </fieldset>
    );
  };

  const renderSelectField = ({
    name,
    label,
    options,
  }: ConfigStepFieldSelect) => {
    const id = name;
    const selected = formData && formData[name];
    return (
      <>
        <Label htmlFor={id} className="block">
          {label}
        </Label>
        <select name={name} id={id} defaultValue={selected}>
          {options.map((item) =>
            renderSelectFieldOption({
              name,
              value: item.value,
              label: item.label,
            })
          )}
        </select>
      </>
    );
  };

  const renderTextField = (field: ConfigStepFieldText) => {
    const { name, label } = field;
    const id = name;
    const value = formData && formData[name];
    return (
      <>
        <Label htmlFor={id} className="block">
          {label}
        </Label>
        <Input type="text" name={name} id={id} defaultValue={value} />
      </>
    );
  };

  const renderField = (field: ConfigStepField) => {
    const { name, type } = field;
    return (
      <div key={name} className="mb-8">
        {type === FieldType.Text && renderTextField(field)}
        {type === FieldType.Radio && renderRadioField(field)}
        {type === FieldType.Select && renderSelectField(field)}
      </div>
    );
  };

  return (
    <div className="bg-beige-100 h-full p-4">
      <h1 className="mb-8 font-bold text-4xl">{headline}</h1>
      {actionData?.errors ? "ERRORS: " + actionData.errors : ""}
      <Form method="post" className="mb-16">
        {fields.map((field: ConfigStepField) => renderField(field))}
        <Button>Weiter</Button>
      </Form>
      <pre>config: {JSON.stringify(config, null, 2)}</pre>
      <pre>cookie: {JSON.stringify(cookie, null, 2)}</pre>
    </div>
  );
}
