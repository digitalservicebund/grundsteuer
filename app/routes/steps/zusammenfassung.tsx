import { Link } from "@remix-run/react";
import { LoaderFunction, useLoaderData } from "remix";
import { getFormDataCookie } from "~/cookies";
import { config, ConfigStep, ConfigStepField } from "~/domain";
import GrundDataModel from "~/domain/model";

export const loader: LoaderFunction = async ({ request }) => {
  return getFormDataCookie(request);
};

// this will activate showing the form navigation in root.tsx
export const handle = {
  showFormNavigation: true,
};

export default function Zusammenfassung() {
  const formData = useLoaderData();
  const dataModel = new GrundDataModel(formData.records);

  const renderField = (stepName: string, field: ConfigStepField) => {
    return (
      <div key={field.name}>
        <dt className="mr-4 inline font-bold">{field.label}</dt>
        <dd className="inline">
          {dataModel.getStepData(stepName) &&
            dataModel.getStepData(stepName)[field.name]}
        </dd>
      </div>
    );
  };

  const renderStep = (step: ConfigStep) => {
    return (
      <div className="mb-8" key={step.name}>
        <h2 className="font-bold text-2xl mb-4">{step.headline}</h2>
        <Link
          to={`/steps/${step.name}`}
          className="mb-4 inline-block underline text-blue-500"
        >
          Edit (/steps/{step.name})
        </Link>
        <dl>{step.fields.map((field) => renderField(step.name, field))}</dl>
      </div>
    );
  };

  return (
    <div className="bg-beige-100 h-full p-4">
      <h1 className="mb-8 font-bold text-4xl">Zusammenfassung</h1>
      <div className="mb-8">
        {config.steps
          .filter((step) =>
            step.condition ? step.condition(formData.records) : true
          )
          .map(renderStep)}
      </div>

      <pre>config: {JSON.stringify(config, null, 2)}</pre>
      <pre>cookie: {JSON.stringify(formData, null, 2)}</pre>
    </div>
  );
}
