import { getStepData, idToIndex, StepFormData } from "~/domain/model";
import {
  getStepDefinition,
  GrundModel,
  StepDefinition,
  StepDefinitionField,
  StepDefinitionFieldWithOptions,
} from "~/domain/steps";
import { getReachablePathsFromGrundData } from "~/domain/states/graph";
import _ from "lodash";
import { i18Next } from "~/i18n.server";
import { PreviousStepsErrors } from "~/routes/formular/zusammenfassung";
import { PruefenModel } from "~/domain/pruefen/model";
import { getCurrentStateWithoutId } from "~/util/getCurrentState";
import { StateMachineContext } from "~/domain/states/states";
import { Validation } from "~/domain/validation/Validation";
import { getErrorMessage } from "~/domain/validation/getErrorMessage";

export type ValidationConfig = Record<string, Validation>;

export const validateStepFormData = async (
  stepDefinition: StepDefinition,
  stepFormData: StepFormData,
  storedFormData: GrundModel | PruefenModel,
  noNewDataAdded?: boolean
): Promise<
  | {
      errors: null;
      validatedStepData: StepFormData;
    }
  | {
      errors: Record<string, string>;
      validatedStepData: null;
    }
> => {
  const errors: Record<string, string> = {};
  const validatedStepData: StepFormData = {};
  const tFunction = await i18Next.getFixedT("de", "all");
  Object.entries(stepDefinition.fields).forEach(
    ([name, field]: [
      string,
      StepDefinitionField | StepDefinitionFieldWithOptions
    ]) => {
      let value = stepFormData[name];
      // unchecked checkbox
      if (typeof value == "undefined") {
        value = "";
      }

      const i18n = { ...(tFunction("errors") as object) };
      const errorMessage = getErrorMessage(
        value,
        field.validations,
        stepFormData,
        storedFormData,
        i18n,
        noNewDataAdded
      );
      if (errorMessage) {
        errors[name] = errorMessage;
      } else {
        validatedStepData[name] = value;
      }
    }
  );
  if (Object.keys(errors).length != 0) {
    console.error(`Validation failed for fields: ${Object.keys(errors)}`);
    return { errors, validatedStepData: null };
  } else {
    return { errors: null, validatedStepData };
  }
};

export const validateAllStepsData = async (
  storedFormData: StateMachineContext
): Promise<PreviousStepsErrors> => {
  const generalErrors = {};
  const reachablePaths = getReachablePathsFromGrundData(storedFormData);
  for (const stepPath of reachablePaths) {
    const stepDefinition = getStepDefinition({
      currentStateWithoutId: getCurrentStateWithoutId(stepPath),
    });

    let fieldErrors: Record<string, string | undefined> = {};
    const stepFormData = getStepData(storedFormData, stepPath);
    if (stepFormData) {
      const { errors } = await validateStepFormData(
        stepDefinition,
        stepFormData,
        storedFormData,
        true
      );
      fieldErrors = errors || {};
    } else {
      Object.keys(stepDefinition.fields).forEach(
        (field) => (fieldErrors[field] = "Bitte ergänzen")
      );
    }
    if (Object.keys(fieldErrors).length !== 0)
      _.set(generalErrors, idToIndex(stepPath), fieldErrors);
  }
  return generalErrors;
};
