import type { StepComponentFunction } from "~/routes/formular/_step";
import { StepFormFields } from "~/components";
import { HelpComponentFunction } from "~/routes/formular/_step";
import AngabenGrundbuchTitle from "~/components/icons/help/AngabenGrundbuchTitle";
import AngabenGrundbuchPage from "~/components/icons/help/AngabenGrundbuchPage";

const GrundstueckFlurstueckAngaben: StepComponentFunction = ({
  stepDefinition,
  formData,
  i18n,
  currentState,
}) => {
  return (
    <div>
      <StepFormFields {...{ stepDefinition, formData, i18n, currentState }} />
    </div>
  );
};

export default GrundstueckFlurstueckAngaben;

export const GrundstueckFlurstueckAngabenHelp: HelpComponentFunction = ({
  i18n,
}) => {
  return (
    <>
      <p className="mb-8">{i18n.help.paragraph1}</p>
      <p className="mb-8">{i18n.help.paragraph2}</p>
      <AngabenGrundbuchTitle className="w-full mb-8" />
      <AngabenGrundbuchPage className="w-full" />
    </>
  );
};
