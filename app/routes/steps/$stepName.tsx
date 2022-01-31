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
import stepConfig from "~/stepConfig";
import type {
  ConfigStepField,
  ConfigStepFieldText,
  ConfigStepFieldSelect,
  ConfigStepFieldRadio,
  ConfigStepFieldOptionsItem,
} from "~/stepConfig";
import nextStep from "~/domain/nextStep";
import allowedStep from "~/domain/allowedStep";
import { getFormDataCookie, createResponseHeaders } from "~/cookies";

const getStepConfig = (stepName: string) => {
  const config = stepConfig.steps.find(({ name }) => name === stepName);
  console.log(config);
  return config;
};

export const loader: LoaderFunction = async ({ params, request }) => {
  invariant(params.stepName, "Expected stepName");
  const config = getStepConfig(params.stepName);
  const cookie = await getFormDataCookie(request);

  if (!config || !allowedStep(params.stepName, cookie.records)) {
    return redirect(`/steps/${nextStep(cookie.records)}`);
  }

  const formData = cookie.records?.[params.stepName];
  return { config, cookie, formData };
};

export const action: ActionFunction = async ({ params, request }) => {
  invariant(params.stepName, "Expected stepName");
  const config = getStepConfig(params.stepName);
  invariant(config, "Expected config");
  const cookie = await getFormDataCookie(request);

  const formData: FormData = await request.formData();

  cookie.records = cookie.records || {};
  cookie.records[params.stepName] = config.fields
    .map((field) => field.name)
    .reduce((acc, name) => {
      return Object.assign(acc, { [name]: formData.get(name) });
    }, {});

  const responseHeader: Headers = await createResponseHeaders(cookie);
  return redirect(`/steps/${nextStep(cookie.records)}`, {
    headers: responseHeader,
  });
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
        {options.map(({ value, label }) =>
          renderRadioFieldOption({ name, value, label })
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
          {options.map(({ value, label }) =>
            renderSelectFieldOption({ name, value, label })
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
        {type === "text" && renderTextField(field)}
        {type === "radio" && renderRadioField(field)}
        {type === "select" && renderSelectField(field)}
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
