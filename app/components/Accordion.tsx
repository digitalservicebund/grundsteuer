import * as BasicAccordion from "@radix-ui/react-accordion";
import RemoveIcon from "~/components/icons/mui/Remove";
import AddIcon from "~/components/icons/mui/Add";
import { ReactElement } from "react";
import classNames from "classnames";

export type AccordionItem = {
  header: string | ReactElement;
  content: ReactElement;
};

export default function Accordion({
  items,
  boldAppearance,
}: {
  items: AccordionItem[];
  boldAppearance?: boolean;
}) {
  return (
    <div className="">
      <BasicAccordion.Root
        type="single"
        collapsible
        className="bg-white border-b-2 border-b-blue-800"
      >
        {items.map((item, index) => (
          <BasicAccordion.Item
            value={`faq-${index + 1}`}
            key={index}
            className="border-t-2 border-t-blue-800"
          >
            <BasicAccordion.Header className="accordion-header">
              <BasicAccordion.Trigger className="w-full p-24 flex items-center justify-between hover:bg-blue-200 focus:bg-blue-200 focus:outline focus:outline-4 focus:outline-blue-800 focus-visible:outline focus-visible:outline-4 focus-visible:outline-blue-800">
                <div
                  className={classNames(
                    "pr-10 font-bold text-left text-16 leading-22 md:text-18 md:leading-24",
                    { "text-blue-800": boldAppearance }
                  )}
                >
                  {item.header}
                </div>
                <AddIcon className="w-24 h-24 flex-shrink-0 fill-blue-800 accordion-open-icon" />
                <RemoveIcon className="w-24 h-24 flex-shrink-0 fill-blue-800 accordion-close-icon" />
              </BasicAccordion.Trigger>
            </BasicAccordion.Header>
            <BasicAccordion.Content className="overflow-hidden accordion-content">
              <div
                className={classNames("p-24 pr-24", {
                  "pr-48 md:pb-64 md:pr-64 text-18": boldAppearance,
                })}
              >
                {item.content}
              </div>
            </BasicAccordion.Content>
          </BasicAccordion.Item>
        ))}
      </BasicAccordion.Root>
    </div>
  );
}
