import { useActionData } from "remix";
import { render } from "~/routes/formular/_step";

export { action, loader, handle } from "./_step";

const headline = "Gebäude";

export default function Gebaeude() {
  const actionData = useActionData();

  return render(actionData, headline, <></>);
}
