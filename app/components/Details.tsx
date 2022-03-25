import { ReactElement, useState } from "react";

export type DetailsProps = {
  summaryContent: ReactElement;
  detailsContent: ReactElement;
};

export default function Details(props: DetailsProps) {
  const { summaryContent, detailsContent } = props;
  const [helpExpanded, setHelpExpanded] = useState(false);

  return (
    <details
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
      <div className="bg-blue-200 p-16 mb-4">{detailsContent}</div>
    </details>
  );
}
