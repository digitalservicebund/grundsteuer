import { useActionData, useLoaderData } from "remix";
import { ConfigStepFieldRadio } from "~/domain";
import { StepRadioField } from "~/components";
import { render } from "~/routes/formular/_step";

export { action, loader, handle } from "~/routes/formular/_step";

const hasVertreter: ConfigStepFieldRadio = {
  name: "hasVertreter",
  options: [{ value: "true" }, { value: "false" }],
  validations: {},
};

export const gesVertreterFields = [hasVertreter];

export default function GesetzlicherVertreter() {
  const { formData, i18n } = useLoaderData();
  const actionData = useActionData();

  hasVertreter.label = i18n.question;
  hasVertreter.options[0].label = i18n.yes;
  hasVertreter.options[1].label = i18n.no;

  return render(
    actionData,
    i18n.headline,
    <>
      <StepRadioField
        config={hasVertreter}
        value={formData?.[hasVertreter.name]}
      />
    </>
  );
}
