import AccordionItem, { AccordionItemProps } from "./AccordionItem";

export default function Accordion({
  items,
  boldAppearance,
}: {
  items: AccordionItemProps[];
  boldAppearance?: boolean;
}) {
  return (
    <div className="bg-white border-b-2 border-b-blue-800">
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          header={item.header}
          content={item.content}
          boldAppearance={boldAppearance}
        />
      ))}
    </div>
  );
}
