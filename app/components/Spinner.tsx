import { useEffect, useState } from "react";
import Button from "./Button";
import RefreshIcon from "./icons/mui/Refresh";
import LoopIcon from "./icons/mui/Loop";
import { Form } from "@remix-run/react";

export default function Spinner(props: {
  initialText?: string;
  waitingText?: string;
  longerWaitingText?: string;
}) {
  const { initialText, waitingText, longerWaitingText } = props;
  const [text, setText] = useState(
    initialText ? initialText : "Anfrage wird verarbetiet."
  );
  const [isJavaScriptEnabled, setIsJavaScriptEnabled] = useState(false);

  useEffect(() => {
    setIsJavaScriptEnabled(true);
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
          <LoopIcon className="w-48 h-48 shrink-0 mr-16" />
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
