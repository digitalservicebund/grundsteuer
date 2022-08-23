import type { StepComponentFunction } from "~/routes/formular/_step";
import {
  ContentContainer,
  FieldError,
  FormGroup,
  Input,
  Radio,
  StepFormField,
} from "~/components";
import { getFieldProps } from "~/util/getFieldProps";
import InputFraction from "~/components/form/InputFraction";
import AnteilHelp from "~/components/form/help/eigentuemer/Anteil";
import { ChangeEvent, useRef } from "react";
import Help from "~/components/form/help/Help";

const EigentuemerAnteil: StepComponentFunction = ({
  stepDefinition,
  formData,
  i18n,
  errors,
  testFeaturesEnabled,
}) => {
  const fieldProps = getFieldProps(stepDefinition, formData, i18n, errors);

  if (!testFeaturesEnabled) {
    return (
      <ContentContainer size="sm-md">
        <FormGroup>
          <InputFraction
            zaehler={<StepFormField {...fieldProps[0]} />}
            nenner={<StepFormField {...fieldProps[1]} />}
            help={<AnteilHelp />}
          />
        </FormGroup>
      </ContentContainer>
    );
  }

  const zaehler = fieldProps[0].value;
  const nenner = fieldProps[1].value;
  const userInputChecked =
    !(zaehler === "1" && ["2", "3", "4"].includes(nenner)) &&
    !(!zaehler && !nenner);

  const zaehlerErrorMessage =
    errors?.zaehler && `Zähler (vor dem Schrägstrich): ${errors.zaehler}`;
  const nennerErrorMessage =
    errors?.nenner && `Nenner (hinter dem Schrägstrich): ${errors.nenner}`;

  const userInputRef = useRef(null);
  const userInputRadioRef = useRef(null);

  // Automatically focus the text field when radio button is checked
  const onRadioChange = (e: ChangeEvent) => {
    if ((e?.target as HTMLInputElement).checked) {
      userInputRef &&
        (userInputRef.current as HTMLInputElement | null)?.focus();
    }
  };

  // Automatically check the radio button when text field get focus
  const onTextFieldFocus = () => {
    userInputRadioRef &&
      (userInputRadioRef.current as HTMLInputElement | null)?.click();
  };

  return (
    <ContentContainer size="sm-md">
      <FormGroup>
        <Radio
          name="zaehlerNenner"
          value="1/2"
          defaultChecked={zaehler === "1" && nenner === "2"}
        >
          1/2 Anteil am Grundstück
        </Radio>
      </FormGroup>
      <FormGroup>
        <Radio
          name="zaehlerNenner"
          value="1/3"
          defaultChecked={zaehler === "1" && nenner === "3"}
        >
          1/3 Anteil am Grundstück
        </Radio>
      </FormGroup>
      <FormGroup>
        <Radio
          name="zaehlerNenner"
          value="1/4"
          defaultChecked={zaehler === "1" && nenner === "4"}
        >
          1/4 Anteil am Grundstück
        </Radio>
      </FormGroup>
      <FormGroup>
        <div className="sm:flex gap-16 items-center">
          <div className="flex-shrink-0">
            <Radio
              name="zaehlerNenner"
              value="userInput"
              defaultChecked={userInputChecked}
              onChange={onRadioChange}
              ref={userInputRadioRef}
            >
              Anteil am Grundstück
            </Radio>
          </div>
          <div className="ml-44 mt-8 sm:m-0">
            <label htmlFor="userInput" className="sr-only">
              Anteil am Grundstück
            </label>
            <Input
              ref={userInputRef}
              name="userInput"
              placeholder="1/6"
              defaultValue={userInputChecked ? `${zaehler}/${nenner}` : ""}
              className="max-w-[20ch]"
              onFocus={onTextFieldFocus}
            />
          </div>
        </div>
        {errors && (
          <FieldError>
            {errors.userInput}
            {zaehlerErrorMessage}
            {zaehlerErrorMessage && nennerErrorMessage && <br />}
            {nennerErrorMessage}
          </FieldError>
        )}
      </FormGroup>

      <div className="mb-80">
        <Help>
          <AnteilHelp />
        </Help>
      </div>
    </ContentContainer>
  );
};

export default EigentuemerAnteil;
