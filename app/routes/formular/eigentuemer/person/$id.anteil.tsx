import { useActionData, useLoaderData } from "remix";
import { StepTextField } from "~/components";
import { render } from "~/routes/formular/_step";
import { eigentuemerAnteilField } from "~/domain/fields/eigentuemer/person/anteil";

export { action, loader, handle } from "~/routes/formular/_step";

export default function Telefonnummer() {
  const { formData, i18n } = useLoaderData();
  const actionData = useActionData();

  const [zaehler, nenner] = eigentuemerAnteilField;
  zaehler.label = i18n[zaehler.name];
  nenner.label = i18n[nenner.name];

  return render(
    actionData,
    i18n.headline,
    <>
      <StepTextField config={zaehler} value={formData?.[zaehler.name]} />
      <StepTextField config={nenner} value={formData?.[nenner.name]} />
    </>
  );
}
