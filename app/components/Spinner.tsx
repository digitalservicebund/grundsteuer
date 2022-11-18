import { useEffect, useState } from "react";
import Button from "./Button";
import RefreshIcon from "./icons/mui/Refresh";
import loopGif from "~/assets/images/loader.gif";
import { Form } from "@remix-run/react";

export default function Spinner(props: {
  initialText?: string;
  waitingText?: string;
  longerWaitingText?: string;
  startTime?: number;
}) {
  const { initialText, waitingText, longerWaitingText, startTime } = props;
  const [text, setText] = useState(
    initialText ? initialText : "Anfrage wird verarbeitet."
  );
  const [isJavaScriptEnabled, setIsJavaScriptEnabled] = useState(false);

  useEffect(() => {
    setIsJavaScriptEnabled(true);
    if (startTime) {
      if (Date.now() - startTime > 30000) {
        setText(
          longerWaitingText
            ? longerWaitingText
            : "Wir bearbeiten weiter Ihre Anfrage. Bitte verlassen Sie diese Seite nicht."
        );
      } else if (Date.now() - startTime > 8000) {
        setText(
          waitingText
            ? waitingText
            : "Ihre Anfrage dauert gerade leider etwas länger. Bitte verlassen Sie diese Seite nicht."
        );
      }
    }
    const timer1 = setTimeout(() => {
      setText(
        waitingText
          ? waitingText
          : "Ihre Anfrage dauert gerade leider etwas länger. Bitte verlassen Sie diese Seite nicht."
      );
    }, 8000);
    const timer2 = setTimeout(() => {
      setText(
        longerWaitingText
          ? longerWaitingText
          : "Wir bearbeiten weiter Ihre Anfrage. Bitte verlassen Sie diese Seite nicht."
      );
    }, 30000);
    return () => {
      if (timer1) clearTimeout(timer1);
      if (timer2) clearTimeout(timer2);
    };
  });

  return (
    <div className="fixed inset-0 flex items-center justify-center p-16">
      <div className="bg-black opacity-40 absolute inset-0" />
      <div className="bg-white rounded-3xl p-32 relative">
        <div className="flex items-center justify-center">
          {isJavaScriptEnabled && (
            <img
              className="w-48 h-48 shrink-0 mr-16"
              src={loopGif}
              alt={"Endlosschleife, die sich im Kreis dreht"}
            />
          )}
          <p className="text-18">{text}</p>
        </div>
        {!isJavaScriptEnabled && (
          <Form reloadDocument method="get" className="mt-32 flex justify-end">
            <Button look="tertiary" icon={<RefreshIcon />}>
              Seite aktualisieren
            </Button>
          </Form>
        )}
      </div>
    </div>
  );
}
