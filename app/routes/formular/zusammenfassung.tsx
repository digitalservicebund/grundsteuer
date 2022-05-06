import {
  ActionFunction,
  json,
  LoaderFunction,
  MetaFunction,
  redirect,
} from "@remix-run/node";
import {
  Form,
  useActionData,
  useFetcher,
  useLoaderData,
} from "@remix-run/react";
import {
  createHeadersWithFormDataCookie,
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
import { Button, FormGroup, Spinner, StepFormField } from "~/components";
import { authenticator } from "~/auth.server";
import { getFieldProps } from "~/util/getFieldProps";
import {
  validateAllStepsData,
  validateStepFormData,
} from "~/domain/validation";
import { getStepI18n, I18nObject } from "~/i18n/getStepI18n";
import ZusammenfassungAccordion from "~/components/form/ZusammenfassungAccordion";
import { removeUndefined } from "~/util/removeUndefined";
import {
  getSuccessResult,
  retrieveResult,
  sendNewGrundsteuer,
} from "~/erica/sendGrundsteuer";
import { transforDataToEricaFormat } from "~/erica/transformData";
import {
  deleteEricaRequestIdSenden,
  findUserByEmail,
  saveEricaRequestIdSenden,
  savePdf,
  saveTransferticket,
  User,
} from "~/domain/user";
import invariant from "tiny-invariant";
import { useEffect, useState } from "react";
import { ericaUtils } from "~/erica/utils";

type LoaderData = {
  formData: StepFormData;
  allData: GrundModel;
  i18n: I18nObject;
  stepDefinition: StepDefinition;
  isIdentified: boolean;
  previousStepsErrors: PreviousStepsErrors;
  ericaErrors: string[];
  showSpinner: boolean;
};

export const loader: LoaderFunction = async ({
  request,
}): Promise<LoaderData | Response> => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/anmelden",
  });
  const userData: User | null = await findUserByEmail(user.email);
  invariant(
    userData,
    "expected a matching user in the database from a user in a cookie session"
  );

  const storedFormData = await getStoredFormData({ request, user });
  const filteredData = filterDataForReachablePaths(storedFormData);
  const cleanedData = removeUndefined(filteredData);

  const previousStepsErrors = await validateAllStepsData(cleanedData);

  // Query Erica result
  let ericaErrors: string[] = [];
  let ericaRequestId = userData.ericaRequestIdSenden;
  if (ericaRequestId) {
    const ericaResponse = await retrieveResult(ericaRequestId);
    if (ericaResponse?.processStatus == "Success") {
      await deleteEricaRequestIdSenden(user.email);
      const { transferticket, pdf } = await getSuccessResult(ericaResponse);
      await saveTransferticket(user.email, transferticket);
      await savePdf(user.email, pdf);
      return redirect("/formular/erfolg");
    } else if (ericaResponse?.processStatus == "Failure") {
      await deleteEricaRequestIdSenden(user.email);
      ericaRequestId = null;
      ericaErrors = ericaUtils.getEricaErrorsFromResponse(ericaResponse);
    }
  }

  return {
    formData: getStepData(storedFormData, "zusammenfassung"),
    allData: cleanedData,
    i18n: await getStepI18n("zusammenfassung"),
    stepDefinition: zusammenfassung,
    isIdentified: user.identified,
    previousStepsErrors,
    ericaErrors,
    showSpinner: !!ericaRequestId,
  };
};

export type PreviousStepsErrors = Record<string, any>;

export type ActionData = {
  errors?: Record<string, string>;
  previousStepsErrors?: PreviousStepsErrors;
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

  const headers = await createHeadersWithFormDataCookie({
    data: formDataToBeStored,
    user,
  });

  // validate all steps' data
  const previousStepsErrors = await validateAllStepsData(formDataToBeStored);
  if (Object.keys(previousStepsErrors).length > 0) {
    return json({ previousStepsErrors: previousStepsErrors }, { headers });
  }

  // Send to Erica
  const transformedData = transforDataToEricaFormat(
    filterDataForReachablePaths(formDataToBeStored)
  );
  const ericaRequestId = await sendNewGrundsteuer(transformedData);
  await saveEricaRequestIdSenden(user.email, ericaRequestId);

  return json({}, { headers });
};

export const meta: MetaFunction = () => {
  return { title: pageTitle("Zusammenfassung Ihrer Eingaben") };
};

export default function Zusammenfassung() {
  const loaderData = useLoaderData<LoaderData>();
  const { formData, allData, i18n, stepDefinition, isIdentified } = loaderData;
  const actionData = useActionData();
  const errors = actionData?.errors;
  const previousStepsErrors =
    loaderData.previousStepsErrors || actionData?.previousStepsErrors;

  const fieldProps = getFieldProps(stepDefinition, formData, i18n, errors);

  // We need to fetch data to check the result with Elster
  const fetcher = useFetcher();
  const [showSpinner, setShowSpinner] = useState(loaderData.showSpinner);
  const [ericaErrors, setEricaErrors] = useState(loaderData.ericaErrors);

  useEffect(() => {
    if (fetcher.data) {
      setShowSpinner(fetcher.data.showSpinner);
      setEricaErrors(fetcher.data.ericaErrors);
    }
  }, [fetcher.data]);

  useEffect(() => {
    if (loaderData) {
      setShowSpinner(loaderData.showSpinner);
      setEricaErrors(loaderData.ericaErrors);
    }
  }, [loaderData]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (showSpinner) {
        fetcher.load("/formular/zusammenfassung");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [fetcher, showSpinner, ericaErrors]);

  return (
    <>
      {ericaErrors.map((ericaError, index) => {
        return (
          <div
            key={index}
            className="bg-red-200 border-l-[16px] border-l-red-900 pl-48 py-16 mb-8"
          >
            {ericaError}
          </div>
        );
      })}
      <div className="pt-32 max-w-screen-md mx-auto w-1/2">
        <h1 className="mb-8 text-4xl font-bold">{i18n.headline}</h1>
        <ZusammenfassungAccordion
          {...{ allData, i18n, errors: previousStepsErrors }}
        />
        <div className="mt-32">
          <Form method="post" className="mb-16">
            <FormGroup>
              <StepFormField {...fieldProps[0]} />
            </FormGroup>
            {!isIdentified && (
              <div>
                <h2 className="mb-16 font-bold underline text-20">
                  {i18n.specifics.fscHeading}
                </h2>
                <Button
                  look="tertiary"
                  to="/fsc/"
                  className="mb-48 text-center"
                >
                  {i18n.specifics.fscLinkText}
                </Button>
              </div>
            )}
            <FormGroup>
              <StepFormField {...fieldProps[1]} />
            </FormGroup>

            <h2 className="mb-8 font-bold text-20">
              {i18n.specifics.confirmationHeading}
            </h2>
            <p className="mb-32">{i18n.specifics.confirmationText}</p>
            <FormGroup>
              <StepFormField {...fieldProps[2]} />
            </FormGroup>
            <FormGroup>
              <StepFormField {...fieldProps[3]} />
            </FormGroup>
            <Button id="nextButton">{i18n.specifics.submitbutton}</Button>
          </Form>
        </div>
      </div>
      {showSpinner && <Spinner />}
    </>
  );
}
