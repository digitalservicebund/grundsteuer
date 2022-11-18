import Bell from "~/components/icons/mui/Bell";
import { ReactNode } from "react";
import classNames from "classnames";
import EmailOutlined from "~/components/icons/mui/EmailOutlined";

export default function Hint(props: {
  title?: string;
  type?: "hint" | "status";
  children: ReactNode;
  className?: string;
}) {
  const type = props.type ? props.type : "hint";
  const title = type === "hint" ? "Hinweis" : "Status";
  const IconCompoent = type === "hint" ? Bell : EmailOutlined;
  const { children, className } = props;
  return (
    <div
      className={classNames(
        "flex flex-col bg-yellow-200 rounded-lg px-36 py-24 mb-32",
        className
      )}
      data-testid="hint-box"
    >
      <div className="flex items-center mb-8">
        {<IconCompoent className="mr-12 inline-block" />}
        <p className="uppercase font-bold inline-block text-11 tracking-1">
          {title}
        </p>
      </div>
      <div data-testid="hint">{children}</div>
    </div>
  );
}
