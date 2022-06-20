import type { StepComponentFunction } from "~/routes/formular/_step";
import {
  ContentContainer,
  FormGroup,
  IntroText,
  StepFormField,
  SubHeadline,
} from "~/components";
import { getFieldProps } from "~/util/getFieldProps";
import InputFraction from "~/components/form/InputFraction";

const FlurstueckFlur: StepComponentFunction = ({
  stepDefinition,
  formData,
  i18n,
  errors,
}) => {
  const fieldProps = getFieldProps(stepDefinition, formData, i18n, errors);

  return (
    <ContentContainer size="sm-md">
      <IntroText>{i18n.specifics.explanation}</IntroText>
      <div>
        <FormGroup>
          <StepFormField {...fieldProps[0]} />
        </FormGroup>
        <FormGroup>
          <fieldset>
            <legend className="mb-8 text-24 leading-30">
              {i18n.specifics.flurstueckSubheading}
            </legend>
            <InputFraction
              zaehler={<StepFormField {...fieldProps[1]} />}
              nenner={<StepFormField {...fieldProps[2]} />}
            />
          </fieldset>
        </FormGroup>
      </div>
    </ContentContainer>
  );
};

export default FlurstueckFlur;
