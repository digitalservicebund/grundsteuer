import { useEffect, useState } from "react";
import Button from "./Button";
import RefreshIcon from "./icons/mui/Refresh";
import loopGif from "~/assets/images/loader.gif";
import { Form } from "@remix-run/react";
import { setInterval } from "timers";

export default function Spinner(props: {
  initialText?: string;
  waitingText?: string;
  longerWaitingText?: string;
  startTime?: number;
}) {
  const [isJavaScriptEnabled, setIsJavaScriptEnabled] = useState(false);

  const { initialText, waitingText, longerWaitingText, startTime } = props;
  const [text, setText] = useState(initialText || "Anfrage wird verarbeitet.");
  const [initialStartTime] = useState(startTime || Date.now());
  const initialTextPeriod = 8000;
  const waitingTextPeriod = 8000;
  const longerWaitingTextPeriod = 30000;

  const setNewText = () => {
    if (Date.now() - initialStartTime > initialTextPeriod) {
      if (
        (Date.now() - initialStartTime - initialTextPeriod) %
          (longerWaitingTextPeriod + waitingTextPeriod) <
        waitingTextPeriod
      ) {
        setText(
          waitingText ||
            "Ihre Anfrage dauert gerade leider etwas länger. Bitte verlassen Sie diese Seite nicht."
        );
      } else {
        setText(
          longerWaitingText ||
            "Wir bearbeiten weiter Ihre Anfrage. Bitte verlassen Sie diese Seite nicht."
        );
      }
    }
  };

  useEffect(() => {
    setIsJavaScriptEnabled(true);
    setInterval(setNewText, 5000);
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
