import { Form, useActionData, useLoaderData } from "remix";
import { Button } from "@digitalservice4germany/digital-service-library";
import { ConfigStepField } from "~/domain";
import { StepTextField } from "~/components";
import { render } from "~/routes/steps/_step";

export { action, loader, handle } from "./../../_step";

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
