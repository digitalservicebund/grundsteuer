import { Form } from "remix";
import { ConfigStepField, FieldType } from "~/domain";
import { StepRadioField, StepSelectField, StepTextField } from "~/components";
import { Button } from "@digitalservice4germany/digital-service-library";
import { AppData } from "@remix-run/react/data";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface BaseDataData {}

export class BaseStepData {
  data: BaseDataData | undefined;

  constructor(formData: Record<string, any> = {}) {
    console.log("Parent");
  }
}

export default class BaseStep {
  headline: string | undefined;
  fields: Array<ConfigStepField> | undefined;
  dataModel: typeof BaseStepData | undefined;

  render(cookie: object, formData: Record<string, any>, actionData: AppData) {
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
        <h1 className="mb-8 font-bold text-4xl">{this.headline}</h1>
        {actionData?.errors ? "ERRORS: " + actionData.errors : ""}
        {this.fields && (
          <Form method="post" className="mb-16">
            {this.fields.map((field: ConfigStepField) => renderField(field))}
            <Button>Weiter</Button>
          </Form>
        )}
        <pre>cookie: {JSON.stringify(cookie, null, 2)}</pre>
      </div>
    );
  }
}
