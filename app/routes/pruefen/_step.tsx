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
  Button,
  ButtonContainer,
  ContentContainer,
  Footer,
} from "~/components";
import { getStepData, setStepData, StepFormData } from "~/domain/model";
import { validateStepFormData } from "~/domain/validation";
import { FallbackStepComponent } from "~/components/steps";
import stepComponents from "~/components/pruefen";
import { StepDefinition } from "~/domain/steps";
import { getCurrentStateFromUrl } from "~/util/getCurrentState";
import { StepHeadline } from "~/components/StepHeadline";
import { pageTitle } from "~/util/pageTitle";
import { getStepI18n, I18nObject } from "~/i18n/getStepI18n";
import ErrorBarStandard from "~/components/ErrorBarStandard";
import { CsrfToken, createCsrfToken, verifyCsrfToken } from "~/util/csrf";
import { getPruefenStepDefinition } from "~/domain/pruefen/steps";
import {
  getPruefenConfig,
  getReachablePathsFromPruefenData,
  PruefenMachineContext,
} from "~/domain/pruefen/states";
import { pruefenConditions } from "~/domain/pruefen/guards";
import { PruefenModel } from "~/domain/pruefen/model";
import { getBackUrl, getRedirectUrl } from "~/util/constructUrls";
import { State } from "xstate/lib/State";
import SectionLabel from "~/components/SectionLabel";
import Communication from "~/components/icons/mui/Communication";
import {
  getFromPruefenStateCookie,
  saveToPruefenStateCookie,
} from "~/cookies.server";
import { commitSession, getSession } from "~/session.server";
import { HomepageHeader } from "~/components/HomepageHeader";

const PREFIX = "pruefen";
const START_STEP = "start";
const SUCCESS_STEP = "nutzung";

export const getMachine = ({ formData }: { formData: PruefenModel }) => {
  const machineContext = { ...formData } as PruefenMachineContext;

  return createMachine(getPruefenConfig(machineContext), {
    guards: pruefenConditions,
  });
};

export type LoaderData = {
  formData: StepFormData;
  allData: PruefenModel;
  i18n: I18nObject;
  backUrl: string | null;
  isFinalStep: boolean;
  isSuccessStep: boolean;
  currentState: string;
  stepDefinition: StepDefinition;
  csrfToken: string;
};

const resetFlow = async () => {
  return redirect("/" + PREFIX + "/" + START_STEP, {
    headers: {
      "Set-Cookie": await saveToPruefenStateCookie(
        getMachine({ formData: {} }).getInitialState(START_STEP)
      ),
    },
  });
};

const redirectIfStateNotReachable = (
  state: State<PruefenModel>,
  currentStateFromUrl: string
) => {
  if (!state) {
    return resetFlow();
  } else if (state.value != currentStateFromUrl) {
    const reachablePaths = getReachablePathsFromPruefenData(state.context);
    if (!reachablePaths.includes(currentStateFromUrl)) {
      return resetFlow();
    }
  }
};

export const loader: LoaderFunction = async ({
  request,
}): Promise<LoaderData | Response> => {
  const currentStateFromUrl = getCurrentStateFromUrl(request.url);
  const cookieHeader = request.headers.get("Cookie");
  const state = (await getFromPruefenStateCookie(cookieHeader)) || undefined;

  const potentialRedirect = redirectIfStateNotReachable(
    state,
    currentStateFromUrl
  );
  if (potentialRedirect) {
    return potentialRedirect;
  }

  const storedFormData = state.context;
  const machine = getMachine({ formData: storedFormData });
  const isFinalStep =
    machine.getStateNodeByPath(currentStateFromUrl).type == "final";
  const isSuccessStep = isFinalStep && currentStateFromUrl == SUCCESS_STEP;
  const backUrl = getBackUrl({
    machine,
    currentStateWithoutId: currentStateFromUrl,
    prefix: PREFIX,
  });
  const stepDefinition = getPruefenStepDefinition({
    currentState: currentStateFromUrl,
  });

  const session = await getSession(request.headers.get("Cookie"));
  const csrfToken = createCsrfToken(session);

  return json(
    {
      formData: getStepData(storedFormData, currentStateFromUrl),
      allData: storedFormData,
      i18n: await getStepI18n(currentStateFromUrl, {}, "default", PREFIX),
      backUrl,
      isFinalStep,
      isSuccessStep,
      currentState: currentStateFromUrl,
      stepDefinition,
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

export const action: ActionFunction = async ({ request }) => {
  await verifyCsrfToken(request);

  const currentState = getCurrentStateFromUrl(request.url);
  const cookieHeader = request.headers.get("Cookie");
  const state = (await getFromPruefenStateCookie(cookieHeader)) || undefined;

  const potentialRedirect = redirectIfStateNotReachable(state, currentState);
  if (potentialRedirect) {
    return potentialRedirect;
  }

  const storedFormData = state.context;

  // validate
  const stepFormData = Object.fromEntries(
    await request.formData()
  ) as unknown as StepFormData;
  const { errors, validatedStepData } = await validateStepFormData(
    getPruefenStepDefinition({ currentState }),
    stepFormData,
    storedFormData
  );
  if (errors) return { errors } as ActionData;

  // store
  const formDataToBeStored = setStepData(
    storedFormData,
    currentState,
    validatedStepData
  ) as PruefenModel;

  const machine = getMachine({ formData: formDataToBeStored });
  const nextState = machine.transition(currentState, {
    type: "NEXT",
  });
  const nextStepUrl = getRedirectUrl(nextState, PREFIX);

  return redirect(nextStepUrl, {
    headers: { "Set-Cookie": await saveToPruefenStateCookie(nextState) },
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
    <>
      <main className="flex-grow mb-56">
        <HomepageHeader pruefenActive={true} />
        <ContentContainer>
          <div className="bg-white px-16 md:px-80 py-16 md:py-56">
            <SectionLabel
              label={"Nutzung prüfen"}
              icon={<Communication fill="#4E596A" />}
              className="mb-32"
            />
            <ContentContainer size="sm-md">
              <Form method="post" className="mb-16" key={currentState}>
                <CsrfToken value={loaderData.csrfToken} />
                {headlineIsLegend ? (
                  <>
                    {currentState == START_STEP && (
                      <h1 className="text-30 leading-36 font-bold mb-16">
                        Prüfen Sie in wenigen Schritten, ob Sie unser Tool
                        nutzen können.
                      </h1>
                    )}
                    <fieldset>
                      <StepHeadline i18n={i18n} asLegend />
                      {actionData?.errors && !isSubmitting && (
                        <ErrorBarStandard />
                      )}
                      <StepComponent {...loaderData} {...actionData} />
                    </fieldset>
                  </>
                ) : (
                  <>
                    <StepHeadline i18n={i18n} />
                    {actionData?.errors && !isSubmitting && (
                      <ErrorBarStandard />
                    )}
                    <StepComponent {...loaderData} {...actionData} />
                  </>
                )}
                <ContentContainer size="sm">
                  <ButtonContainer>
                    {!loaderData?.isFinalStep && (
                      <>
                        <Button
                          id="nextButton"
                          className={backUrl ? "" : "flex-grow-0"}
                          disabled={isSubmitting}
                        >
                          {nextButtonLabel}
                        </Button>
                        {backUrl && (
                          <Button to={backUrl} look="secondary">
                            {i18n.common.back}
                          </Button>
                        )}
                      </>
                    )}
                    {loaderData?.isFinalStep && (
                      <>
                        {loaderData?.isSuccessStep && (
                          <Button
                            to="/formular/welcome"
                            id="nextButton"
                            className={backUrl ? "" : "flex-grow-0"}
                          >
                            {nextButtonLabel}
                          </Button>
                        )}
                        <Button to="/" look="secondary">
                          {i18n.common.backToHomepage}
                        </Button>
                      </>
                    )}
                  </ButtonContainer>
                </ContentContainer>
              </Form>
            </ContentContainer>
          </div>
        </ContentContainer>
      </main>
      <Footer />
    </>
  );
}
