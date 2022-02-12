import { Form, useActionData, useLoaderData } from "remix";
import { Button } from "@digitalservice4germany/digital-service-library";
import { ConfigStepField, FieldType } from "~/domain";
import { StepTextField } from "~/components";
import { render } from "~/routes/steps/_step";

export { action, loader } from "./../../_step";

export default function Adresse() {
  const { formData } = useLoaderData();
  const actionData = useActionData();

  const streetAddress: ConfigStepField = {
    name: "strasse",
    type: FieldType.Text,
    label: "Straße",
  };

  const houseNo: ConfigStepField = {
    name: "hausnummer",
    type: FieldType.Text,
    label: "Hausnummer",
  };

  return render(
    actionData,
    "Adresse",

    <Form method="post" className="mb-16">
      <StepTextField
        config={streetAddress}
        value={formData?.[streetAddress.name]}
      />
      <StepTextField config={houseNo} value={formData?.[houseNo.name]} />
      <Button>Weiter</Button>
    </Form>
  );
}
