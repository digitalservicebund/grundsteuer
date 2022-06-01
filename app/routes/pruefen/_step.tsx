import {
  ActionFunction,
  createCookie,
  LoaderFunction,
  MetaFunction,
  redirect,
} from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useTransition,
} from "@remix-run/react";
import { createMachine } from "xstate";
import _ from "lodash";
import { Button, ButtonContainer, ContentContainer } from "~/components";
import { getStepData, setStepData, StepFormData } from "~/domain/model";
import { validateStepFormData } from "~/domain/validation";
import stepComponents, { FallbackStepComponent } from "~/components/steps";
import { StepDefinition } from "~/domain/steps";
import { getCurrentStateFromUrl } from "~/util/getCurrentState";
import { StepHeadline } from "~/components/StepHeadline";
import { pageTitle } from "~/util/pageTitle";
import { getSession } from "~/session.server";
import { getStepI18n, I18nObject } from "~/i18n/getStepI18n";
import ErrorBarStandard from "~/components/ErrorBarStandard";
import { CsrfToken, verifyCsrfToken } from "~/util/csrf";
import { getPruefenStepDefinition } from "~/domain/pruefen/steps";
import {
  getPruefenConfig,
  PruefenMachineContext,
} from "~/domain/pruefen/states";
import { pruefenConditions } from "~/domain/pruefen/guards";
import { PruefenModel } from "~/domain/pruefen/model";
import { getBackUrl, getRedirectUrl } from "~/util/constructUrls";

export const PREFIX = "pruefen";

const getMachine = ({ formData }: { formData: PruefenModel }) => {
  const machineContext = { ...formData } as PruefenMachineContext;

  return createMachine(getPruefenConfig(machineContext), {
    guards: pruefenConditions,
  });
};

const pruefenCookie = createCookie(PREFIX, {
  maxAge: 604_800, // one week
});

export type LoaderData = {
  formData: StepFormData;
  allData: PruefenModel;
  i18n: I18nObject;
  backUrl: string | null;
  currentState: string;
  stepDefinition: StepDefinition;
};

export const loader: LoaderFunction = async ({
  request,
}): Promise<LoaderData | Response> => {
  const cookieHeader = request.headers.get("Cookie");
  const storedFormData = (await pruefenCookie.parse(cookieHeader)) || {};
  const currentState = getCurrentStateFromUrl(request.url);

  const machine = getMachine({ formData: storedFormData });

  // TODO redirect in case the step is not enabled

  const backUrl = getBackUrl({
    machine,
    currentStateWithoutId: currentState,
    prefix: PREFIX,
  });
  const stepDefinition = getPruefenStepDefinition({ currentState });

  return {
    formData: getStepData(storedFormData, currentState),
    allData: storedFormData,
    i18n: await getStepI18n(currentState, {}, "default", PREFIX),
    backUrl,
    currentState,
    stepDefinition,
  };
};

export type ActionData = {
  errors: Record<string, string>;
};

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  await verifyCsrfToken(request, session);

  const cookieHeader = request.headers.get("Cookie");
  const storedFormData = (await pruefenCookie.parse(cookieHeader)) || {};
  const currentState = getCurrentStateFromUrl(request.url);

  // validate
  const stepFormData = Object.fromEntries(
    await request.formData()
  ) as unknown as StepFormData;
  const errors = await validateStepFormData(
    getPruefenStepDefinition({ currentState }),
    stepFormData,
    storedFormData
  );
  if (Object.keys(errors).length > 0) return { errors } as ActionData;

  // store
  const formDataToBeStored = setStepData(
    storedFormData,
    currentState,
    stepFormData
  ) as PruefenModel;

  const machine = getMachine({ formData: formDataToBeStored });
  const nextState = machine.transition(currentState, {
    type: "NEXT",
  });
  const redirectUrl = getRedirectUrl(nextState, PREFIX);

  return redirect(redirectUrl, {
    headers: {
      "Set-Cookie": await pruefenCookie.serialize(formDataToBeStored),
    },
  });
};

export const meta: MetaFunction = ({ data }) => {
  return { title: pageTitle(data?.i18n?.headline) };
};

export type StepComponentFunction = (
  props: LoaderData & ActionData
) => JSX.Element;

export function Step() {
  const loaderData = useLoaderData();
  const actionData = useActionData() as ActionData;
  const transition = useTransition();
  const isSubmitting = Boolean(transition.submission);
  const { i18n, backUrl, currentState } = loaderData;
  const StepComponent =
    _.get(stepComponents, currentState) || FallbackStepComponent;

  const nextButtonLabel = i18n.nextButtonLabel
    ? i18n.nextButtonLabel
    : i18n.common.continue;

  const fields = loaderData.stepDefinition?.fields;
  const headlineIsLegend =
    fields &&
    Object.keys(fields).length === 1 &&
    fields[Object.keys(fields)[0]].type === "radio";

  return (
    <ContentContainer size="sm">
      <Form method="post" className="mb-16" key={currentState}>
        <CsrfToken />
        {headlineIsLegend ? (
          <fieldset>
            <StepHeadline i18n={i18n} asLegend />
            {actionData?.errors && <ErrorBarStandard />}
            <StepComponent {...loaderData} {...actionData} />
          </fieldset>
        ) : (
          <>
            <StepHeadline i18n={i18n} />
            {actionData?.errors && <ErrorBarStandard />}
            <StepComponent {...loaderData} {...actionData} />
          </>
        )}
        <ButtonContainer>
          <Button
            id="nextButton"
            className={backUrl ? "" : "flex-grow-0"}
            disabled={isSubmitting}
          >
            {nextButtonLabel}
          </Button>
          {backUrl ? (
            <Button to={backUrl} look="secondary">
              {i18n.common.back}
            </Button>
          ) : (
            ""
          )}
        </ButtonContainer>
      </Form>
    </ContentContainer>
  );
}
