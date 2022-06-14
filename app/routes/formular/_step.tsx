import {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
  redirect,
  json,
} from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useTransition,
} from "@remix-run/react";
import { createMachine } from "xstate";
import _ from "lodash";
import {
  BreadcrumbNavigation,
  Button,
  ButtonContainer,
  ContentContainer,
} from "~/components";
import {
  createHeadersWithFormDataCookie,
  getStoredFormData,
} from "~/formDataStorage.server";
import { getStepData, setStepData, StepFormData } from "~/domain/model";
import { getMachineConfig, StateMachineContext } from "~/domain/states";
import { conditions } from "~/domain/guards";
import { validateStepFormData } from "~/domain/validation";
import { actions } from "~/domain/actions";
import stepComponents, { FallbackStepComponent } from "~/components/steps";
import { getStepDefinition, GrundModel, StepDefinition } from "~/domain/steps";
import {
  getCurrentStateFromUrl,
  getCurrentStateWithoutId,
} from "~/util/getCurrentState";
import { StepHeadline } from "~/components/StepHeadline";
import { getReachablePathsFromGrundData } from "~/domain";
import { pageTitle } from "~/util/pageTitle";
import { authenticator } from "~/auth.server";
import { commitSession, getSession } from "~/session.server";
import { Params } from "react-router";
import { getStepI18n, I18nObject } from "~/i18n/getStepI18n";
import ErrorBarStandard from "~/components/ErrorBarStandard";
import { createCsrfToken, CsrfToken, verifyCsrfToken } from "~/util/csrf";
import { getBackUrl, getRedirectUrl } from "~/util/constructUrls";

export const PREFIX = "formular";

const getMachine = ({
  formData,
  params,
}: {
  formData: GrundModel;
  params: Params;
}) => {
  const machineContext = { ...formData } as StateMachineContext;
  if (params.personId) {
    machineContext.personId = parseInt(params.personId);
  } else if (params.flurstueckId) {
    machineContext.flurstueckId = parseInt(params.flurstueckId);
  }

  return createMachine(getMachineConfig(machineContext), {
    guards: conditions,
    actions: actions,
  });
};

export type LoaderData = {
  formData: StepFormData;
  allData: GrundModel;
  i18n: I18nObject;
  backUrl: string | null;
  currentStateWithoutId: string;
  currentState?: string;
  stepDefinition: StepDefinition;
  redirectToSummary?: boolean;
  csrfToken?: string;
};

export const loader: LoaderFunction = async ({
  params,
  request,
}): Promise<LoaderData | Response> => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/anmelden",
  });

  const session = await getSession(request.headers.get("Cookie"));

  const storedFormData = await getStoredFormData({ request, user });

  const currentState = getCurrentStateFromUrl(request.url);
  const currentStateWithoutId = getCurrentStateWithoutId(currentState);

  const machine = getMachine({ formData: storedFormData, params });
  const stateNodeType = machine.getStateNodeByPath(currentStateWithoutId).type;

  // redirect to first fitting child node
  if (stateNodeType == "compound") {
    const inititalState = machine.transition(currentStateWithoutId, "FAKE");
    const redirectUrl = getRedirectUrl(inititalState, PREFIX);
    return redirect(redirectUrl);
  }
  // redirect in case the step is not enabled
  const reachablePaths = getReachablePathsFromGrundData(storedFormData);
  if (!reachablePaths.includes(currentState)) {
    return redirect("/formular/welcome");
  }

  const backUrl = getBackUrl({
    machine,
    currentStateWithoutId,
    prefix: PREFIX,
  });
  const stepDefinition = getStepDefinition({ currentStateWithoutId });
  const redirectToSummary = !!new URL(request.url).searchParams.get(
    "redirectToSummary"
  );

  const bundesland = storedFormData.grundstueck?.adresse?.bundesland;

  const csrfToken = createCsrfToken(session);

  return json(
    {
      formData: getStepData(storedFormData, currentState),
      allData: storedFormData,
      i18n: await getStepI18n(
        currentStateWithoutId,
        {
          id: params?.personId || params?.flurstueckId,
        },
        bundesland ? bundesland : "default"
      ),
      backUrl,
      currentStateWithoutId,
      currentState,
      stepDefinition,
      redirectToSummary,
      csrfToken,
    },
    {
      headers: { "Set-Cookie": await commitSession(session) },
    }
  );
};

export type ActionData = {
  errors: Record<string, string>;
};

export const action: ActionFunction = async ({ params, request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/anmelden",
  });
  await verifyCsrfToken(request);

  const storedFormData = await getStoredFormData({ request, user });

  const currentState = getCurrentStateFromUrl(request.url);
  const currentStateWithoutId = getCurrentStateWithoutId(currentState);

  // validate
  const stepFormData = Object.fromEntries(
    await request.formData()
  ) as unknown as StepFormData;
  const { errors, validatedStepData } = await validateStepFormData(
    getStepDefinition({ currentStateWithoutId }),
    stepFormData,
    storedFormData
  );
  if (errors) return { errors } as ActionData;

  // store
  const formDataToBeStored = setStepData(
    storedFormData,
    currentState,
    validatedStepData
  ) as GrundModel;
  const headers = await createHeadersWithFormDataCookie({
    data: formDataToBeStored,
    user,
  });

  // redirect
  if (new URL(request.url).searchParams.get("redirectToSummary")) {
    return redirect("/formular/zusammenfassung", {
      headers,
    });
  }

  const machine = getMachine({ formData: formDataToBeStored, params });
  const nextState = machine.transition(currentStateWithoutId, {
    type: "NEXT",
  });
  const redirectUrl = getRedirectUrl(nextState, PREFIX);

  return redirect(redirectUrl, {
    headers,
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
  const {
    i18n,
    backUrl,
    currentStateWithoutId,
    currentState,
    redirectToSummary,
    csrfToken,
  } = loaderData;
  const StepComponent =
    _.get(stepComponents, currentStateWithoutId) || FallbackStepComponent;

  let nextButtonLabel: string;
  if (redirectToSummary) {
    nextButtonLabel = i18n.common.backToSummary;
  } else {
    nextButtonLabel = i18n.nextButtonLabel
      ? i18n.nextButtonLabel
      : i18n.common.continue;
  }
  const fields = loaderData.stepDefinition?.fields;
  const headlineIsLegend =
    fields &&
    Object.keys(fields).length === 1 &&
    fields[Object.keys(fields)[0]].type === "radio";

  return (
    <>
      <ContentContainer size="sm-md">
        <BreadcrumbNavigation />
      </ContentContainer>
      <Form
        method="post"
        className="mb-16"
        key={currentState}
        action={redirectToSummary ? "?redirectToSummary=true" : ""}
      >
        <CsrfToken value={csrfToken} />
        {headlineIsLegend ? (
          <fieldset>
            <ContentContainer size="sm-md">
              <StepHeadline i18n={i18n} asLegend />
              {actionData?.errors && <ErrorBarStandard />}
            </ContentContainer>
            <StepComponent {...loaderData} {...actionData} />
          </fieldset>
        ) : (
          <>
            <ContentContainer size="sm-md">
              <StepHeadline i18n={i18n} />
              {actionData?.errors && <ErrorBarStandard />}
            </ContentContainer>
            <StepComponent {...loaderData} {...actionData} />
          </>
        )}
        <ContentContainer size="sm-md">
          <ButtonContainer className="input-width">
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
        </ContentContainer>
      </Form>
    </>
  );
}
