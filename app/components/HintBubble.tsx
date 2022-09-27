import AnnouncementOutlined from "~/components/icons/mui/AnnouncementOutlined";
import classNames from "classnames";

export default function HintBubble(props: {
  index?: string;
  className?: string;
}) {
  const cssClasses = classNames(
    "inline-flex flex-row items-center gap-8 font-bold bg-yellow-500 text-gray-900 pl-12 pr-16 py-6 mb-16 rounded-[.25rem] uppercase text-[.7rem] tracking-widest",
    props.className
  );
  return (
    <div className={cssClasses}>
      <AnnouncementOutlined />
      Hinweis {props.index}
    </div>
  );
}
