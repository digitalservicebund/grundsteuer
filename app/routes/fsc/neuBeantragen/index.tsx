import { LoaderFunction } from "@remix-run/node";
import {
  BreadcrumbNavigation,
  Button,
  ButtonContainer,
  ContentContainer,
  FormGroup,
  Headline,
  IntroText,
  MaskedInput,
  Spinner,
} from "~/components";
import Hint from "~/components/Hint";
import ErrorBar from "~/components/ErrorBar";
import {
  Form,
  useActionData,
  useFetcher,
  useLoaderData,
  useTransition,
} from "@remix-run/react";
import { CsrfToken } from "~/util/csrf";
import SteuerIdField from "~/components/form/SteuerIdField";
import { useEffect, useState } from "react";
import EnumeratedCard from "~/components/EnumeratedCard";
import freischaltcodeImg from "~/assets/images/help/freischaltcode-no-explanation.png";

export const loader: LoaderFunction = async () => {
  return {};
};

export default function FscNeuBeantragen() {
  const loaderData = useLoaderData();
  const actionData = useActionData();
  const errors = actionData?.errors;

  // We need to fetch data to check the result with Elster
  const fetcher = useFetcher();
  const transition = useTransition();
  const isSubmitting = Boolean(transition.submission);

  const [showSpinner, setShowSpinner] = useState(loaderData?.showSpinner);
  const [showError, setShowError] = useState(loaderData?.showError);

  useEffect(() => {
    if (fetcher.data) {
      setShowSpinner(fetcher.data.showSpinner);
      setShowError(fetcher.data.showError);
    }
  }, [fetcher.data]);

  useEffect(() => {
    if (loaderData) {
      setShowSpinner(loaderData.showSpinner);
      setShowError(loaderData.showError);
    }
  }, [loaderData]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (showSpinner) {
        fetcher.load("/fsc/neuBeantragen?index");
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [fetcher, showSpinner]);

  return (
    <div className="lg:pr-[10%]">
      <ContentContainer size="sm">
        <BreadcrumbNavigation />
        <Headline>Bitte geben Sie Ihren Freischaltcode ein</Headline>
        <IntroText>
          Falls der Brief nach zwei Wochen bei Ihnen nicht angekommen ist,
          empfehlen wir Ihnen, den Freischaltcode neu zu beantragen.
        </IntroText>
        <IntroText>
          Der zuvor beantragte Freischaltcode wird automatisch storniert und
          kann nicht mehr eingegeben werden.
        </IntroText>

        <Hint>
          Sie erhalten keinen Brief, wenn Sie bereits ein Konto bei Mein ELSTER
          und dort einen Abrufcode beantragt haben. In diesem Fall können Sie
          die Identifikation mit einem Freischaltcode leider nicht verwenden.
          Wir planen aber, ab September die Identifikation mit einem ELSTER
          Zertifikat anzubieten.
        </Hint>

        {showError && !isSubmitting && (
          <ErrorBar className="mb-32">
            Mit diesen Daten können wir keinen Freischaltcode beantragen.
          </ErrorBar>
        )}

        <Form method="post" action={"/fsc/neuBeantragen?index"}>
          <CsrfToken value={loaderData.csrfToken} />
          <div>
            <FormGroup>
              <SteuerIdField
                name="steuerId"
                label="Steuer-Identifikationsnummer"
                placeholder="11 111 111 111"
                error={errors?.steuerId}
              />
            </FormGroup>
            <FormGroup>
              <MaskedInput
                mask="Date"
                name="geburtsdatum"
                label="Geburtsdatum"
                placeholder="TT.MM.JJJJ"
                error={errors?.geburtsdatum}
                className="w-1/2"
              />
            </FormGroup>
          </div>
          <ButtonContainer className="mb-80">
            <Button disabled={isSubmitting || showSpinner}>
              Freischaltcode neu beantragen
            </Button>
            <Button look="secondary" to="/formular/welcome">
              Zurück
            </Button>
          </ButtonContainer>
        </Form>
        {showSpinner && (
          <Spinner
            initialText={"Ihr Freischaltcode wird beantragt."}
            waitingText={
              "Das Beantragen dauert gerade leider etwas länger. Bitte verlassen Sie diese Seite nicht."
            }
            longerWaitingText={
              "Wir beantragen weiter Ihren Freischaltcode. Bitte verlassen Sie diese Seite nicht."
            }
          />
        )}
      </ContentContainer>
      <div className="md:mb-144">
        <h2 className="text-24 mb-24">
          Wo finde ich den Freischaltcode auf dem Brief vom Finanzamt?
        </h2>
        <EnumeratedCard
          image={freischaltcodeImg}
          imageAltText="Beispiel Freischaltcode Brief"
          heading="Brief vom Finanzamt"
          text="Ihnen wurde ein Brief per Post zugestellt. In diesem finden Sie den 12-stelligen Freischaltcode."
          className="mb-16"
        />
      </div>
    </div>
  );
}
