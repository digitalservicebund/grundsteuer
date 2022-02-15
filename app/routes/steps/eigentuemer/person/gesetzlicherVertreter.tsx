import { useActionData, useLoaderData } from "remix";
import { ConfigStepFieldRadio } from "~/domain";
import { StepRadioField } from "~/components";
import { render } from "~/routes/steps/_step";

export { action, loader, handle } from "./../../_step";

const headline = "Gesetzlicher Vertreter";

export default function GesetzlicherVertreter() {
  const { formData } = useLoaderData();
  const actionData = useActionData();

  const gesVertreter: ConfigStepFieldRadio = {
    name: "gesvertreter",
    label: "Möchten Sie einen gesetzlichen Vertreter angeben?",
    options: [
      { label: "Ja, ich möchte einen ges. Vetreter angeben", value: "true" },
      {
        label: "Nein, ich möchte keinen ges. Vetreter angeben",
        value: "false",
      },
    ],
    validations: {},
  };

  return render(
    actionData,
    headline,
    <>
      <StepRadioField
        config={gesVertreter}
        value={formData?.[gesVertreter.name]}
      />
    </>
  );
}
