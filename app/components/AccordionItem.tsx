import { ReactElement, useState } from "react";
import RemoveIcon from "~/components/icons/mui/Remove";
import AddIcon from "~/components/icons/mui/Add";
import classNames from "classnames";

export type AccordionItemProps = {
  header: string | ReactElement;
  content: ReactElement;
  boldAppearance?: boolean;
};

export default function AccordionItem(props: AccordionItemProps) {
  const { header, content, boldAppearance } = props;
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <details
      onToggle={() => setIsExpanded(!isExpanded)}
      className="border-t-2 border-t-blue-800 group"
    >
      <summary
        role="button"
        aria-expanded={isExpanded}
        className="accordion-summary w-full p-24 flex items-center justify-between hover:bg-blue-200 focus:bg-blue-200 focus:outline focus:outline-4 focus:outline-blue-800 focus-visible:outline focus-visible:outline-4 focus-visible:outline-blue-800 cursor-pointer group-open:bg-blue-200"
      >
        <div
          className={classNames(
            "pr-10 font-bold text-left text-16 leading-22 md:text-18 md:leading-24",
            { "text-blue-800": boldAppearance }
          )}
        >
          {header}
        </div>
        <AddIcon className="w-24 h-24 flex-shrink-0 fill-blue-800 group-open:hidden" />
        <RemoveIcon className="w-24 h-24 flex-shrink-0 fill-blue-800 hidden group-open:block" />
      </summary>
      <div
        className={classNames("p-24 pr-24", {
          "pr-48 md:pb-64 md:pr-64 text-18": boldAppearance,
        })}
      >
        {content}
      </div>
    </details>
  );
}
