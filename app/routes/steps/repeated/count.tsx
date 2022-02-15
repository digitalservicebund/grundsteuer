import { Form, useActionData, useLoaderData } from "remix";
import { Button } from "@digitalservice4germany/digital-service-library";
import { ConfigStepField } from "~/domain";
import { StepTextField } from "~/components";
import { render } from "~/routes/steps/_step";

export { action, loader, handle } from "./../_step";

export default function Count() {
  const { formData } = useLoaderData();
  const actionData = useActionData();

  const count: ConfigStepField = {
    name: "count",
    label: "Wieviele Items?",
  };

  return render(
    actionData,
    "Count Items",

    <Form method="post" className="mb-16">
      <StepTextField
        config={count}
        value={formData?.[count.name]}
      />
      <input type="hidden" name="stepName" value="adresse" />
      <Button>Weiter</Button>
    </Form>
  );
}
