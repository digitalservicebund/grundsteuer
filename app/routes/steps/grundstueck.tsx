import { useActionData, useLoaderData } from "remix";
import { ConfigStepField } from "~/domain";
import { StepTextField } from "~/components";
import { render } from "~/routes/steps/_step";

export { action, loader, handle } from "./_step";

const headline = "Grundstück";

export default function Anzahl() {
  const { formData } = useLoaderData();
  const actionData = useActionData();

  return render(actionData, headline, <></>);
}
