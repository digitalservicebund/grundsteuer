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
import { CsrfToken, verifyCsrfToken } from "~/util/csrf";
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
import { HomepageHeader } from "~/routes";
import SectionLabel from "~/components/SectionLabel";
import Communication from "~/components/icons/mui/Communication";
import { pruefenStateCookie } from "~/cookies";

const PREFIX = "pruefen";
const START_STEP = "eigentuemerTyp";

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
  currentState: string;
  stepDefinition: StepDefinition;
};

const resetFlow = async () => {
  return redirect(START_STEP, {
    headers: {
      "Set-Cookie": await pruefenStateCookie.serialize(
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
  const state = (await pruefenStateCookie.parse(cookieHeader)) || undefined;

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
  const backUrl = getBackUrl({
    machine,
    currentStateWithoutId: currentStateFromUrl,
    prefix: PREFIX,
  });
  const stepDefinition = getPruefenStepDefinition({
    currentState: currentStateFromUrl,
  });

  return {
    formData: getStepData(storedFormData, currentStateFromUrl),
    allData: storedFormData,
    i18n: await getStepI18n(currentStateFromUrl, {}, "default", PREFIX),
    backUrl,
    isFinalStep,
    currentState: currentStateFromUrl,
    stepDefinition,
  };
};

export type ActionData = {
  errors: Record<string, string>;
};

export const action: ActionFunction = async ({ request }) => {
  await verifyCsrfToken(request);

  const currentState = getCurrentStateFromUrl(request.url);
  const cookieHeader = request.headers.get("Cookie");
  const state = (await pruefenStateCookie.parse(cookieHeader)) || undefined;

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
    headers: { "Set-Cookie": await pruefenStateCookie.serialize(nextState) },
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
      <main className="flex-grow pt-32 mb-56">
        <ContentContainer>
          <HomepageHeader loaderData={loaderData} pruefenActive={true} />
          <div className="bg-white px-80 py-56">
            <SectionLabel
              label={"Nutzung prüfen"}
              icon={<Communication fill="#4E596A" />}
              className="mb-32"
            />
            <ContentContainer size="md">
              <Form method="post" className="mb-16" key={currentState}>
                <CsrfToken />
                {headlineIsLegend ? (
                  <>
                    {currentState == START_STEP && (
                      <h1 className="text-30 leading-36 font-bold">
                        Prüfen Sie in wenigen Schritten, ob Sie unser Tool
                        nutzen können.
                      </h1>
                    )}
                    <fieldset>
                      <StepHeadline i18n={i18n} asLegend />
                      {actionData?.errors && <ErrorBarStandard />}
                      <StepComponent {...loaderData} {...actionData} />
                    </fieldset>
                  </>
                ) : (
                  <>
                    <StepHeadline i18n={i18n} />
                    {actionData?.errors && <ErrorBarStandard />}
                    <StepComponent {...loaderData} {...actionData} />
                  </>
                )}
                {loaderData?.isFinalStep && (
                  <Button to={"/"} look="secondary">
                    {i18n.common.backToHomepage}
                  </Button>
                )}
                {!loaderData?.isFinalStep && (
                  <ContentContainer size="sm">
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
                  </ContentContainer>
                )}
              </Form>
            </ContentContainer>
          </div>
        </ContentContainer>
      </main>
      <Footer />
    </>
  );
}
