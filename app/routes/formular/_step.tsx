import {
  ActionFunction,
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
import stepComponents, {
  FallbackStepComponent,
  helpComponents,
} from "~/components/steps";
import { getStepDefinition, GrundModel, StepDefinition } from "~/domain/steps";
import {
  getCurrentStateFromUrl,
  getCurrentStateWithoutId,
} from "~/util/getCurrentState";
import { State } from "xstate/lib/State";
import { StateSchema, Typestate } from "xstate/lib/types";
import { StepHeadline } from "~/components/StepHeadline";
import { getReachablePathsFromData } from "~/domain";
import { pageTitle } from "~/util/pageTitle";
import { authenticator } from "~/auth.server";
import { getSession } from "~/session.server";
import { Params } from "react-router";
import { getStepI18n, I18nObject } from "~/i18n/getStepI18n";
import ErrorBarStandard from "~/components/ErrorBarStandard";
import { CsrfToken, verifyCsrfToken } from "~/util/csrf";

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

const getBackUrl = ({
  machine,
  currentStateWithoutId,
}: {
  machine: any;
  currentStateWithoutId: string;
}) => {
  const backState = machine.transition(currentStateWithoutId, {
    type: "BACK",
  });
  const dotNotation = backState.toStrings().at(-1);
  if (
    dotNotation === currentStateWithoutId &&
    currentStateWithoutId !== "grundstueck.flurstueck.angaben"
  ) {
    return null;
  }
  let backUrl = `/formular/${dotNotation.split(".").join("/")}`;
  if (backState.matches("eigentuemer.person")) {
    backUrl = backUrl.replace(
      "person/",
      `person/${(backState.context as StateMachineContext).personId || 1}/`
    );
  } else if (backState.matches("grundstueck.flurstueck")) {
    backUrl = backUrl.replace(
      "flurstueck/",
      `flurstueck/${
        (backState.context as StateMachineContext).flurstueckId || 1
      }/`
    );
  }
  return backUrl;
};

const getRedirectUrl = (
  state: State<
    StateMachineContext,
    Event,
    StateSchema,
    Typestate<StateMachineContext>,
    any
  >
): string => {
  let redirectUrl = `/formular/${state
    .toStrings()
    .at(-1)
    ?.split(".")
    .join("/")}`;
  if (state.matches("eigentuemer.person")) {
    redirectUrl = redirectUrl.replace(
      "person/",
      `person/${state.context.personId || 1}/`
    );
  } else if (state.matches("grundstueck.flurstueck")) {
    redirectUrl = redirectUrl.replace(
      "flurstueck/",
      `flurstueck/${state.context.flurstueckId || 1}/`
    );
  }
  return redirectUrl;
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
};

export const loader: LoaderFunction = async ({
  params,
  request,
}): Promise<LoaderData | Response> => {
  const session = await getSession(request.headers.get("Cookie"));
  const user = session.get("user");
  const storedFormData = await getStoredFormData({ request, user });

  const currentState = getCurrentStateFromUrl(request.url);
  const currentStateWithoutId = getCurrentStateWithoutId(currentState);

  const machine = getMachine({ formData: storedFormData, params });
  const stateNodeType = machine.getStateNodeByPath(currentStateWithoutId).type;
  // redirect to first fitting child node
  if (stateNodeType == "compound") {
    const inititalState = machine.transition(currentStateWithoutId, "FAKE");
    const redirectUrl = getRedirectUrl(inititalState);
    return redirect(redirectUrl);
  }
  // redirect in case the step is not enabled
  const reachablePaths = getReachablePathsFromData(storedFormData);
  if (!reachablePaths.includes(currentState)) {
    return redirect("/formular/welcome");
  }

  const backUrl = getBackUrl({ machine, currentStateWithoutId });
  const stepDefinition = getStepDefinition({ currentStateWithoutId });
  const redirectToSummary = !!new URL(request.url).searchParams.get(
    "redirectToSummary"
  );

  const bundesland = storedFormData.grundstueck?.adresse?.bundesland;

  return {
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
  };
};

export type ActionData = {
  errors: Record<string, string>;
};

export const action: ActionFunction = async ({ params, request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/anmelden",
  });
  const session = await getSession(request.headers.get("Cookie"));
  await verifyCsrfToken(request, session);

  const storedFormData = await getStoredFormData({ request, user });

  const currentState = getCurrentStateFromUrl(request.url);
  const currentStateWithoutId = getCurrentStateWithoutId(currentState);

  // validate
  const stepFormData = Object.fromEntries(
    await request.formData()
  ) as unknown as StepFormData;
  const errors = await validateStepFormData(
    getStepDefinition({ currentStateWithoutId }),
    stepFormData,
    storedFormData
  );
  if (Object.keys(errors).length > 0) return { errors } as ActionData;

  // store
  const formDataToBeStored = setStepData(
    storedFormData,
    currentState,
    stepFormData
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
  const redirectUrl = getRedirectUrl(nextState);

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

export type HelpComponentFunction = (
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
  } = loaderData;
  const StepComponent =
    _.get(stepComponents, currentStateWithoutId) || FallbackStepComponent;
  const HelpComponent =
    _.get(helpComponents, currentStateWithoutId) || undefined;

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
    <ContentContainer size="sm">
      <BreadcrumbNavigation />
      <Form
        method="post"
        className="mb-16"
        key={currentState}
        action={redirectToSummary ? "?redirectToSummary=true" : ""}
      >
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
      {HelpComponent && false && (
        <div className="md:w-1/4 bg-blue-400 h-full px-16 py-32">
          <HelpComponent {...loaderData} {...actionData} />
        </div>
      )}
    </ContentContainer>
  );
}
