import { useActionData, useLoaderData } from "remix";
import { ConfigStepField } from "~/domain";
import { StepTextField } from "~/components";
import { render } from "~/routes/steps/_step";

export { action, loader, handle } from "./../../_step";

const headline = "Persönliche Angaben";

export default function SteuerId() {
  const { formData } = useLoaderData();
  const actionData = useActionData();

  return render(actionData, headline, <></>);
}
