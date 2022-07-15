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
import { getStepDefinition, GrundModel, StepDefinition } from "~/domain/steps";
import { pageTitle } from "~/util/pageTitle";
import {
  filterDataForReachablePaths,
  getStepData,
  setStepData,
  StepFormData,
} from "~/domain/model";
import { zusammenfassung } from "~/domain/steps/zusammenfassung";
import {
  Button,
  ContentContainer,
  Headline,
  Spinner,
  StepFormField,
} from "~/components";
import { authenticator } from "~/auth.server";
import { getFieldProps } from "~/util/getFieldProps";
import {
  validateAllStepsData,
  validateStepFormData,
} from "~/domain/validation";
import { getStepI18n, I18nObject } from "~/i18n/getStepI18n";
import ZusammenfassungAccordion from "~/components/form/ZusammenfassungAccordion";
import { retrieveResult, sendNewGrundsteuer } from "~/erica/sendGrundsteuer";
import { transformDataToEricaFormat } from "~/erica/transformData";
import {
  deleteEricaRequestIdSenden,
  findUserByEmail,
  saveEricaRequestIdSenden,
  savePdf,
  saveTransferticket,
  setUserInDeclarationProcess,
  User,
} from "~/domain/user";
import invariant from "tiny-invariant";
import { useEffect, useState } from "react";
import { EricaError } from "~/erica/utils";
import ErrorBar from "~/components/ErrorBar";
import { AuditLogEvent, saveAuditLog } from "~/audit/auditLog";
import Send from "~/components/icons/mui/Send";
import Attention from "~/components/icons/mui/Attention";
import { CsrfToken, verifyCsrfToken, createCsrfToken } from "~/util/csrf";
import { getSession, commitSession } from "~/session.server";
import { Trans } from "react-i18next";
import ErrorBarStandard from "~/components/ErrorBarStandard";
import bcrypt from "bcryptjs";

type LoaderData = {
  formData: StepFormData;
  allData: GrundModel;
  i18n: I18nObject;
  stepDefinition: StepDefinition;
  isIdentified: boolean;
  previousStepsErrors: PreviousStepsErrors;
  ericaErrors: string[];
  showSpinner: boolean;
  csrfToken?: string;
};

export const getEricaErrorMessagesFromResponse = (
  errorResponse: EricaError
): string[] => {
  if (errorResponse.errorType == "ERIC_GLOBAL_PRUEF_FEHLER") {
    return errorResponse.validationErrors || ["Bitte prüfen Sie Ihre Angaben."];
  }
  if (
    [
      "ERIC_GLOBAL_BUFANR_UNBEKANNT",
      "INVALID_BUFA_NUMBER",
      "INVALID_TAX_NUMBER",
      "ERIC_GLOBAL_STEUERNUMMER_UNGUELTIG",
      "ERIC_GLOBAL_EWAZ_UNGUELTIG",
    ].includes(errorResponse.errorType)
  ) {
    const steuernummerInvalidMessage =
      "Es scheint ein Problem mit Ihrer angegebenen Steuernummer/Aktenzeichen gegeben zu haben. Bitte prüfen Sie Ihre Angaben.";
    return [steuernummerInvalidMessage];
  }
  throw Error("Unexpected Error: " + errorResponse.errorType);
};

export const saveConfirmationAuditLogs = async (
  clientIp: string,
  email: string,
  data: GrundModel
) => {
  invariant(
    data.zusammenfassung?.confirmCompleteCorrect == "true",
    "confirmCompleteCorrect should be checked"
  );
  invariant(
    data.zusammenfassung?.confirmDataPrivacy == "true",
    "confirmDataPrivacy should be checked"
  );
  invariant(
    data.zusammenfassung?.confirmTermsOfUse == "true",
    "confirmTermsOfUse should be checked"
  );

  await saveAuditLog({
    eventName: AuditLogEvent.CONFIRMED_COMPLETE_CORRECT,
    timestamp: Date.now(),
    ipAddress: clientIp,
    username: email,
    eventData: {
      value: data.zusammenfassung.confirmCompleteCorrect,
    },
  });
  await saveAuditLog({
    eventName: AuditLogEvent.CONFIRMED_DATA_PRIVACY,
    timestamp: Date.now(),
    ipAddress: clientIp,
    username: email,
    eventData: {
      value: data.zusammenfassung.confirmDataPrivacy,
    },
  });
  await saveAuditLog({
    eventName: AuditLogEvent.CONFIRMED_TERMS_OF_USE,
    timestamp: Date.now(),
    ipAddress: clientIp,
    username: email,
    eventData: {
      value: data.zusammenfassung.confirmTermsOfUse,
    },
  });
};

export const loader: LoaderFunction = async ({
  request,
  context,
}): Promise<LoaderData | Response> => {
  const { clientIp } = context;
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/anmelden",
  });
  const userData: User | null = await findUserByEmail(user.email);
  invariant(
    userData,
    "expected a matching user in the database from a user in a cookie session"
  );
  const session = await getSession(request.headers.get("Cookie"));

  const storedFormData = await getStoredFormData({ request, user });
  const filteredData = filterDataForReachablePaths(storedFormData);

  const previousStepsErrors = await validateAllStepsData(filteredData);

  // Query Erica result
  let ericaErrors: string[] = [];
  let ericaRequestId = userData.ericaRequestIdSenden;
  if (ericaRequestId) {
    const successResponseOrErrors = await retrieveResult(ericaRequestId);
    if (successResponseOrErrors) {
      if ("pdf" in successResponseOrErrors) {
        await deleteEricaRequestIdSenden(user.email);
        await saveTransferticket(
          user.email,
          successResponseOrErrors.transferticket
        );
        await savePdf(user.email, successResponseOrErrors.pdf);
        await saveAuditLog({
          eventName: AuditLogEvent.TAX_DECLARATION_SENT,
          timestamp: Date.now(),
          ipAddress: clientIp,
          username: userData.email,
          eventData: { transferticket: successResponseOrErrors.transferticket },
        });
        invariant(
          process.env.HASHED_LOGGING_SALT,
          "Environment variable HASHED_LOGGING_SALT is not defined"
        );
        console.log(
          `Tax declaration filed for user with id ${userData.id} for state ${
            filteredData.grundstueck?.adresse?.bundesland
          } and grundstueck ${
            filteredData.grundstueck?.steuernummer?.steuernummer
              ? await bcrypt.hash(
                  filteredData.grundstueck?.steuernummer?.steuernummer,
                  process.env.HASHED_LOGGING_SALT
                )
              : "no steuernummer given"
          }`
        );
        await setUserInDeclarationProcess(userData.email, false);
        session.set(
          "user",
          Object.assign(session.get("user"), { inDeclarationProcess: false })
        );
        return redirect("/formular/erfolg", {
          headers: {
            "Set-Cookie": await commitSession(session),
          },
        });
      } else {
        await deleteEricaRequestIdSenden(user.email);
        ericaRequestId = null;
        ericaErrors = getEricaErrorMessagesFromResponse(
          successResponseOrErrors
        );
      }
    }
  }
  const csrfToken = createCsrfToken(session);

  return json(
    {
      csrfToken,
      formData: getStepData(storedFormData, "zusammenfassung"),
      allData: filteredData,
      i18n: await getStepI18n("zusammenfassung"),
      stepDefinition: zusammenfassung,
      isIdentified: userData.identified,
      previousStepsErrors,
      ericaErrors,
      showSpinner: !!ericaRequestId,
    },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    }
  );
};

export type PreviousStepsErrors = {
  [key: string]: PreviousStepsErrors | string;
};

export type ActionData = {
  errors?: Record<string, string>;
  previousStepsErrors?: PreviousStepsErrors;
};

export const action: ActionFunction = async ({
  request,
  context,
}): Promise<ActionData | Response> => {
  const { clientIp } = context;
  await verifyCsrfToken(request);

  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/anmelden",
  });

  if (!user.identified) throw new Error("user not identified!");

  const storedFormData = await getStoredFormData({ request, user });

  // validate this step's data
  const zusammenfassungFormData = Object.fromEntries(
    await request.formData()
  ) as unknown as StepFormData;
  const { errors, validatedStepData } = await validateStepFormData(
    getStepDefinition({ currentStateWithoutId: "zusammenfassung" }),
    zusammenfassungFormData,
    storedFormData
  );
  if (errors) return { errors };

  // store
  const formDataToBeStored = setStepData(
    storedFormData,
    "zusammenfassung",
    validatedStepData
  ) as GrundModel;

  const headers = await createHeadersWithFormDataCookie({
    data: formDataToBeStored,
    user,
  });

  // validate all steps' data
  const previousStepsErrors = await validateAllStepsData(formDataToBeStored);
  if (Object.keys(previousStepsErrors).length > 0) {
    return json({ previousStepsErrors: previousStepsErrors }, { headers });
  }

  await saveConfirmationAuditLogs(clientIp, user.email, formDataToBeStored);

  // Send to Erica
  const transformedData = transformDataToEricaFormat(
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
      <ContentContainer size="md">
        <ContentContainer size="sm-md">
          <Headline>{i18n.headline}</Headline>
        </ContentContainer>
        {actionData?.previousStepsErrors && (
          <ErrorBar
            className="mb-32"
            heading={i18n.specifics.errorsInPreviousStepsHeading}
          >
            {i18n.specifics.errorsInPreviousSteps}
          </ErrorBar>
        )}
        {ericaErrors.length !== 0 && (
          <ErrorBar
            className="mb-32"
            heading={"Bitte prüfen oder ergänzen Sie Ihre Angaben."}
          >
            <ul className="pl-16 list-disc">
              {ericaErrors.map((ericaError, index) => {
                return <li key={index}>{ericaError}</li>;
              })}
            </ul>
          </ErrorBar>
        )}
        {actionData?.errors && <ErrorBarStandard />}

        <Form method="post" className="mb-16">
          <CsrfToken value={loaderData.csrfToken} />
          <ZusammenfassungAccordion
            {...{
              allData,
              i18n,
              errors: previousStepsErrors,
              freitextFieldProps: fieldProps[0],
            }}
          />
          {!isIdentified && (
            <div className="bg-yellow-200 mt-32 p-32 pr-48 flex flex-row">
              <div className="rounded-placeholder bg-yellow-400 mr-8">
                <Attention className="min-w-[22px]" />
              </div>

              <div className="flex flex-col">
                <h2 className="mb-8 text-18 font-bold">
                  {i18n.specifics.fscHeading}
                </h2>
                <p className="mb-24">{i18n.specifics.fscExplanation}</p>
                <Button
                  look="tertiary"
                  to="/fsc?redirectToSummary=true"
                  className="text-center w-fit"
                >
                  {i18n.specifics.fscLinkText}
                </Button>
              </div>
            </div>
          )}

          <ContentContainer size="sm-md">
            <h2 className="mb-24 mt-48 text-24 leading-30">
              {i18n.specifics.confirmationHeading}
            </h2>
            <p className="mb-16">{i18n.specifics.confirmationText}</p>
            <p className="font-bold mb-32">{i18n.specifics.pdfDisclaimer}</p>
          </ContentContainer>
          <ContentContainer size="sm-md" className="bg-white p-16 mb-16">
            <StepFormField {...fieldProps[1]}>
              {i18n.fields.confirmCompleteCorrect.label}
            </StepFormField>
          </ContentContainer>
          <ContentContainer size="sm-md" className="bg-white p-16 mb-16">
            <StepFormField {...{ ...fieldProps[2] }}>
              <Trans
                components={{
                  dataPrivacyLink: (
                    <a
                      href="/datenschutz"
                      target="_blank"
                      className="font-bold underline"
                    />
                  ),
                  bmfDataPrivacyLink: (
                    <a
                      href="https://www.bundesfinanzministerium.de/Content/DE/Downloads/BMF_Schreiben/Weitere_Steuerthemen/Abgabenordnung/2020-07-01-Korrektur-Allgemeine-Informationen-Datenschutz-Grundverordnung-Steuerverwaltung-anlage-1.pdf?__blob=publicationFile&v=3"
                      target="_blank"
                      className="font-bold underline"
                    />
                  ),
                }}
              >
                {i18n.fields.confirmDataPrivacy.label}
              </Trans>
            </StepFormField>
          </ContentContainer>
          <ContentContainer size="sm-md" className="bg-white p-16 mb-80">
            <StepFormField {...fieldProps[3]}>
              <Trans
                components={{
                  termsOfUseLink: (
                    <a
                      href="/nutzungsbedingungen"
                      target="_blank"
                      className="font-bold underline"
                    />
                  ),
                }}
              >
                {i18n.fields.confirmTermsOfUse.label}
              </Trans>
            </StepFormField>
          </ContentContainer>
          <Button
            id="nextButton"
            disabled={!isIdentified}
            iconRight={<Send className="h-[10px]" />}
          >
            {i18n.specifics.submitbutton}
          </Button>
        </Form>
      </ContentContainer>
      {showSpinner && <Spinner />}
    </>
  );
}
