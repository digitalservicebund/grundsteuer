import { ReactNode, useState } from "react";
import Cancel from "~/components/icons/mui/Cancel";
import Info from "~/components/icons/mui/Info";

export default function Help(props: { children: ReactNode }) {
  const { children } = props;
  const [helpExpanded, setHelpExpanded] = useState(false);
  const summaryTextClasses = "ml-6 uppercase font-bold";
  let summaryContent = (
    <div className={"flex"}>
      <Info />
      <p className={summaryTextClasses}>Hilfe</p>
    </div>
  );
  if (helpExpanded) {
    summaryContent = (
      <div className={"flex"}>
        <Cancel />
        <p className={summaryTextClasses}>Hilfe schließen</p>
      </div>
    );
  }
  return (
    <details
      className={"mt-10"}
      onToggle={() => setHelpExpanded(!helpExpanded)}
      data-testid="help-details"
    >
      <summary
        className="list-none"
        role="button"
        aria-expanded={helpExpanded}
        tabIndex={0}
        data-testid="help-summary"
      >
        {summaryContent}
      </summary>
      <div className={"bg-yellow-500 h-8 mt-8"} />
      <div className="bg-white py-32 px-24 mb-24">{children}</div>
    </details>
  );
}
