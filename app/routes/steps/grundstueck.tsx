import { useActionData } from "remix";
import { render } from "~/routes/steps/_step";

export { action, loader, handle } from "./_step";

const headline = "Grundstück";

export default function Grundstueck() {
  const actionData = useActionData();

  return render(actionData, headline, <></>);
}
