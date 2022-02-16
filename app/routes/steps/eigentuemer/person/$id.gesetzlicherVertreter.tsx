import { useActionData, useLoaderData } from "remix";
import { ConfigStepFieldRadio } from "~/domain";
import { StepRadioField } from "~/components";
import { render } from "~/routes/steps/_step";

export { action, loader, handle } from "~/routes/steps/_step";

const gesVertreter: ConfigStepFieldRadio = {
  name: "gesetzlicherVertreter",
  options: [{ value: "true" }, { value: "false" }],
  validations: {},
};

export const gesVertreterFields = [gesVertreter];

export default function GesetzlicherVertreter() {
  const { formData, i18n } = useLoaderData();
  const actionData = useActionData();

  gesVertreter.label = i18n.question;
  gesVertreter.options[0].label = i18n.yes;
  gesVertreter.options[1].label = i18n.no;

  return render(
    actionData,
    i18n.headline,
    <>
      <StepRadioField
        config={gesVertreter}
        value={formData?.[gesVertreter.name]}
      />
    </>
  );
}
