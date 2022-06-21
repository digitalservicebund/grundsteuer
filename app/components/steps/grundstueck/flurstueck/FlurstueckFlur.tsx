import type { StepComponentFunction } from "~/routes/formular/_step";
import {
  ContentContainer,
  FormGroup,
  IntroText,
  StepFormField,
} from "~/components";
import { getFieldProps } from "~/util/getFieldProps";
import InputFraction from "~/components/form/InputFraction";
import FlurstueckZaehlerHelp from "~/components/form/help/grundstueck/FlurstueckZaehler";

const FlurstueckFlur: StepComponentFunction = ({
  stepDefinition,
  formData,
  i18n,
  errors,
  currentState,
}) => {
  const fieldProps = getFieldProps(stepDefinition, formData, i18n, errors);

  return (
    <ContentContainer size="sm-md">
      <IntroText>{i18n.specifics.explanation}</IntroText>
      <div>
        <FormGroup>
          <StepFormField {...fieldProps[0]} currentState={currentState} />
        </FormGroup>
        <FormGroup>
          <fieldset>
            <legend className="mb-8 text-24 leading-30">
              {i18n.specifics.flurstueckSubheading}
            </legend>
            <InputFraction
              zaehler={
                <StepFormField {...fieldProps[1]} currentState={currentState} />
              }
              nenner={
                <StepFormField {...fieldProps[2]} currentState={currentState} />
              }
              help={<FlurstueckZaehlerHelp />}
            />
          </fieldset>
        </FormGroup>
      </div>
    </ContentContainer>
  );
};

export default FlurstueckFlur;
