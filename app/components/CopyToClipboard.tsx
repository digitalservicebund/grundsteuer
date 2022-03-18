import { useEffect, useState } from "react";
import copy from "copy-to-clipboard";
import Button from "./Button";
import FileCopyIcon from "./icons/mui/FileCopy";

type CopyToClipboardProps = {
  buttonSize?: "medium" | "large";
  contentToCopy: string;
  contentToDisplay?: string;
};

export default function CopyToClipboard(props: CopyToClipboardProps) {
  const { buttonSize, contentToDisplay, contentToCopy } = props;

  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (isCopied) {
      timer = setTimeout(() => {
        setIsCopied(false);
      }, 5000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  });

  function onClick() {
    copy(contentToCopy);
    setIsCopied(true);
  }

  return (
    <div className="relative">
      <Button
        look="tertiary"
        size={buttonSize}
        icon={<FileCopyIcon />}
        onClick={onClick}
      >
        {contentToDisplay || contentToCopy}
      </Button>

      {isCopied ? (
        <div className="absolute z-10 -bottom-80 left-0 right-0 flex flex-col items-center">
          <div className="bg-white w-12 h-12 rotate-45 relative top-6" />
          <div className="bg-white rounded-md p-16 text-center shadow">
            Der Link wurde in die
            <br />
            Zwischenablage kopiert.
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
