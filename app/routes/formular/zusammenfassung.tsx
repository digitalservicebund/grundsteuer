import {
  ActionFunction,
  Form,
  LoaderFunction,
  MetaFunction,
  redirect,
  useActionData,
  useLoaderData,
} from "remix";
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

type LoaderData = {
  formData: StepFormData;
  allData: GrundModel;
  i18n: I18nObject;
  stepDefinition: StepDefinition;
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/anmelden",
  });
  const storedFormData = await getStoredFormData({ request, user });
  const filteredData = filterDataForReachablePaths(storedFormData);

  return {
    formData: getStepData(storedFormData, "zusammenfassung"),
    allData: filteredData,
    i18n: await getStepI18n("zusammenfassung"),
    stepDefinition: zusammenfassung,
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

  // validate all steps' data
  const generalErrors = await validateAllStepsData(formDataToBeStored);
  if (Object.keys(generalErrors).length > 0) return { generalErrors };

  const headers = new Headers();
  await addFormDataCookiesToHeaders({
    headers,
    data: formDataToBeStored,
    user,
  });

  return redirect("formular/erfolg", {
    headers,
  });
};

export const meta: MetaFunction = () => {
  return { title: pageTitle("Zusammenfassung Ihrer Eingaben") };
};

export default function Zusammenfassung() {
  const { formData, allData, i18n, stepDefinition } =
    useLoaderData<LoaderData>();
  const actionData = useActionData();
  const errors = actionData?.errors;
  const generalErrors = actionData?.generalErrors;

  const fieldProps = getFieldProps(stepDefinition, formData, i18n, errors);

  return (
    <div className="pt-32 max-w-screen-md mx-auto w-1/2">
      <h1 className="mb-8 font-bold text-4xl">Zusammenfassung</h1>
      <ZusammenfassungAccordion {...{ allData, i18n, generalErrors }} />
      <div className="mt-32">
        <Form method="post" className="mb-16">
          <StepFormField {...fieldProps[0]} />
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
