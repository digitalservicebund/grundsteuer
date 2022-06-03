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
import { getSession } from "~/session.server";
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
import House from "~/components/icons/mui/House";
import Communication from "~/components/icons/mui/Communication";

export const PREFIX = "pruefen";
const START_STEP = "eigentuemerTyp";

const getMachine = ({ formData }: { formData: PruefenModel }) => {
  const machineContext = { ...formData } as PruefenMachineContext;

  return createMachine(getPruefenConfig(machineContext), {
    guards: pruefenConditions,
  });
};

const pruefenCookie = createCookie(PREFIX, {
  maxAge: 604_800, // one week
});

const pruefenStateCookie = createCookie("pruefen_state", {
  maxAge: 604_800, // one week
});

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
    headers: [
      ["Set-Cookie", await pruefenCookie.serialize({})],
      [
        "Set-Cookie",
        await pruefenStateCookie.serialize(
          getMachine({ formData: {} }).getInitialState(START_STEP)
        ),
      ],
    ],
  });
};

const redirectIfStateNotReachable = (
  state: State<PruefenModel>,
  currentState: string
) => {
  if (!state) {
    return resetFlow();
  } else if (state.value != currentState) {
    const reachablePaths = getReachablePathsFromPruefenData(state.context);
    if (!reachablePaths.includes(currentState)) {
      return resetFlow();
    }
  }
};

export const loader: LoaderFunction = async ({
  request,
}): Promise<LoaderData | Response> => {
  const currentState = getCurrentStateFromUrl(request.url);
  const cookieHeader = request.headers.get("Cookie");
  const state = (await pruefenStateCookie.parse(cookieHeader)) || undefined;

  const potentialRedirect = redirectIfStateNotReachable(state, currentState);
  if (potentialRedirect) {
    return potentialRedirect;
  }

  const storedFormData = state.context;
  const machine = getMachine({ formData: storedFormData });
  const isFinalStep = machine.getStateNodeByPath(currentState).type == "final";
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
    isFinalStep,
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
  const nextStepUrl = getRedirectUrl(nextState, PREFIX);

  return redirect(nextStepUrl, {
    headers: [
      ["Set-Cookie", await pruefenCookie.serialize(formDataToBeStored)],
      ["Set-Cookie", await pruefenStateCookie.serialize(nextState)],
    ],
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
          <HomepageHeader loaderData={loaderData} />
          <div className="bg-white px-80 py-56">
            <SectionLabel
              label={"Nutzung prüfen"}
              icon={<Communication fill="#4E596A" />}
            />
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
                {loaderData?.isFinalStep && (
                  <Button to={"/"} look="secondary">
                    {i18n.common.backToHomepage}
                  </Button>
                )}
                {!loaderData?.isFinalStep && (
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
