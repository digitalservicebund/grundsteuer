import { ReactNode } from "react";
import { Link } from "@remix-run/react";
import classNames from "classnames";

type NavigationLinkProps = {
  children: ReactNode;
  to?: string;
  isActive?: boolean;
  isAllCaps?: boolean;
  icon?: ReactNode;
  isFinished?: boolean;
  isDisabled?: boolean;
};

export default function NavigationLink(props: NavigationLinkProps) {
  const {
    isActive,
    isAllCaps,
    isFinished,
    isDisabled,
    to,
    icon,
    children,
    ...otherProps
  } = props;
  const cssClasses = classNames(
    "navigation-link flex w-full py-6 pl-8 pr-16 text-16 leading-24 hover:underline hover:bg-blue-200 focus:bg-blue-200 focus:outline-none focus:shadow-[inset_0_0_0_2px_#004b76] focus-visible:shadow-[inset_0_0_0_2px_#004b76]",
    {
      "bg-blue-200": isActive,
      "text-14 uppercase font-bold": isAllCaps,
      "text-gray-800": isDisabled,
    }
  );

  const borderColor = isFinished ? "bg-green-700" : " border-2 border-gray-600";
  const finishedIcon =
    typeof isFinished !== "undefined" ? (
      <div className="w-24 h-24 flex items-center justify-center">
        <div className={`w-8 h-8 rounded-full ${borderColor}`}></div>
      </div>
    ) : null;

  const content = (
    <>
      <div className="mr-8">{icon || finishedIcon}</div>
      {children}
    </>
  );

  if (to && !isDisabled) {
    return (
      <Link to={to} {...otherProps} className={cssClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button disabled={isDisabled} {...otherProps} className={cssClasses}>
      {content}
    </button>
  );
}
