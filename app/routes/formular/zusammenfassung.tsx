import {
  ActionFunction,
  json,
  LoaderFunction,
  MetaFunction,
  redirect,
} from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import {
  addFormDataCookiesToHeaders,
  getStoredFormData,
} from "~/formDataStorage.server";
import { GrundModel, StepDefinition } from "~/domain/steps";
import { pageTitle } from "~/util/pageTitle";
import {
  filterDataForReachablePaths,
  getStepData,
  setStepData,
  StepFormData,
} from "~/domain/model";
import { zusammenfassung } from "~/domain/steps/zusammenfassung";
import { Button, StepFormField } from "~/components";
import { authenticator } from "~/auth.server";
import { getFieldProps } from "~/util/getFieldProps";
import {
  validateAllStepsData,
  validateStepFormData,
} from "~/domain/validation";
import { getStepI18n, I18nObject } from "~/util/getStepI18n";
import ZusammenfassungAccordion from "~/components/form/ZusammenfassungAccordion";
import { removeUndefined } from "~/util/removeUndefined";
import { commitSession } from "~/session.server";

type LoaderData = {
  formData: StepFormData;
  allData: GrundModel;
  i18n: I18nObject;
  stepDefinition: StepDefinition;
  isIdentified: boolean;
  generalErrors: GeneralErrors;
};

export const loader: LoaderFunction = async ({
  request,
}): Promise<LoaderData> => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/anmelden",
  });
  const storedFormData = await getStoredFormData({ request, user });
  const filteredData = filterDataForReachablePaths(storedFormData);
  const cleanedData = removeUndefined(filteredData);

  // validate all steps' data
  const generalErrors = await validateAllStepsData(cleanedData);

  return {
    formData: getStepData(storedFormData, "zusammenfassung"),
    allData: cleanedData,
    i18n: await getStepI18n("zusammenfassung"),
    stepDefinition: zusammenfassung,
    isIdentified: user.identified,
    generalErrors,
  };
};

export type GeneralErrors = Record<string, any>;

export type ActionData = {
  errors?: Record<string, string>;
  generalErrors?: GeneralErrors;
};

export const action: ActionFunction = async ({
  request,
}): Promise<ActionData | Response> => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/anmelden",
  });
  const storedFormData = await getStoredFormData({ request, user });

  // validate this step's data
  const zusammenfassungFormData = Object.fromEntries(
    await request.formData()
  ) as unknown as StepFormData;
  const errors = await validateStepFormData(
    "zusammenfassung",
    zusammenfassungFormData,
    storedFormData
  );
  if (Object.keys(errors).length > 0) return { errors };

  // store
  const formDataToBeStored = setStepData(
    storedFormData,
    "zusammenfassung",
    zusammenfassungFormData
  );
  const headers = new Headers();
  await addFormDataCookiesToHeaders({
    headers,
    data: formDataToBeStored,
    user,
  });

  // validate all steps' data
  const generalErrors = await validateAllStepsData(formDataToBeStored);
  if (Object.keys(generalErrors).length > 0) {
    return json({ generalErrors }, { headers });
  }

  return redirect("formular/erfolg", {
    headers,
  });
};

export const meta: MetaFunction = () => {
  return { title: pageTitle("Zusammenfassung Ihrer Eingaben") };
};

export default function Zusammenfassung() {
  const loaderData = useLoaderData<LoaderData>();
  const { formData, allData, i18n, stepDefinition, isIdentified } = loaderData;
  const actionData = useActionData();
  const errors = actionData?.errors;
  const generalErrors = loaderData.generalErrors || actionData?.generalErrors;

  const fieldProps = getFieldProps(stepDefinition, formData, i18n, errors);

  return (
    <div className="pt-32 max-w-screen-md mx-auto w-1/2">
      <h1 className="mb-8 font-bold text-4xl">{i18n.headline}</h1>
      <ZusammenfassungAccordion {...{ allData, i18n, generalErrors }} />
      <div className="mt-32">
        <Form method="post" className="mb-16">
          <StepFormField {...fieldProps[0]} />
          {!isIdentified && (
            <div>
              <h2 className="font-bold text-20 mb-16 underline">
                {i18n.specifics.fscHeading}
              </h2>
              <Button
                look="tertiary"
                to="/fsc/beantragen"
                className="mb-48 text-center"
              >
                {i18n.specifics.fscLinkText}
              </Button>
            </div>
          )}
          <StepFormField {...fieldProps[1]} />

          <h2 className="font-bold text-20 mb-8">
            {i18n.specifics.confirmationHeading}
          </h2>
          <p className="mb-32">{i18n.specifics.confirmationText}</p>
          <StepFormField {...fieldProps[2]} />
          <StepFormField {...fieldProps[3]} />
          <Button id="nextButton">{i18n.specifics.submitbutton}</Button>
        </Form>
      </div>
    </div>
  );
}
