import React, { ReactElement } from "react";
import { Link, LinkProps } from "@remix-run/react";
import classNames from "classnames";

interface VisualProps {
  look?: "primary" | "secondary" | "tertiary" | "ghost";
  size?: "large" | "medium" | "small";
  icon?: ReactElement;
  iconRight?: ReactElement;
}

export interface ButtonProps
  extends React.ComponentPropsWithoutRef<"button">,
    VisualProps {}

export interface ButtonLinkProps
  extends React.ComponentPropsWithoutRef<"a">,
    VisualProps {
  disabled?: boolean;
}

export interface ButtonRemixLinkProps extends LinkProps, VisualProps {
  disabled?: boolean;
}

function Button(props: ButtonProps): JSX.Element;
function Button(props: ButtonLinkProps): JSX.Element;
function Button(props: ButtonRemixLinkProps): JSX.Element;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Button(props: any) {
  const {
    look = "primary",
    size = "large",
    children,
    icon,
    iconRight,
    className,
    ...rest
  } = props;

  const iconLeft = children && icon;
  const iconOnly = !children && icon;

  const isFakeDisabledButton =
    ((props as ButtonLinkProps).href || (props as ButtonRemixLinkProps).to) &&
    props.disabled;

  const Component =
    (isFakeDisabledButton && "button") ||
    ((props as ButtonLinkProps).href && "a") ||
    ((props as ButtonRemixLinkProps).to && Link) ||
    "button";

  const buttonClassName = classNames(
    "button rounded-none inline-flex items-center max-w-full font-bold text-center disabled:cursor-not-allowed",
    // "focus:" styles are for browsers without support for "focus-visible:" (Safari)
    "focus:outline focus:outline-4 focus:outline-offset-4 focus:outline-blue-800",
    // in supported browsers the "focus:" styles above are disabled (see tailwind.css)
    // and the following styles are applied instead
    "focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-blue-800",
    {
      "px-24": !iconOnly,
      "px-14": iconOnly && size === "large",
      "px-12": iconOnly && size === "medium",
      "px-8": iconOnly && size === "small",
      "py-14 text-18 leading-24": size === "large",
      "text-16 leading-22": size !== "large",
      "py-12": size === "medium",
      "py-8": size === "small",
      "bg-blue-800 text-white hover:bg-blue-700 active:bg-blue-500 active:text-blue-800":
        look === "primary",
      "bg-yellow-500 shadow-[inset_0_0_0_2px_#004b76] text-blue-800 hover:bg-yellow-700 active:bg-yellow-400 focus-visible:shadow-none disabled:shadow-none":
        look === "secondary",
      "disabled:bg-gray-400 disabled:text-gray-600":
        look === "primary" || look === "secondary",
      "bg-transparent shadow-[inset_0_0_0_2px_#004b76] text-blue-800 hover:bg-blue-200 focus:bg-blue-200 active:bg-blue-200 active:shadow-none disabled:bg-transparent disabled:shadow-[inset_0_0_0_2px_#b8bdc3] disabled:text-gray-600":
        look === "tertiary",
      "text-blue-800 hover:shadow-[inset_0_0_0_2px_#b8bdc3] focus:shadow-[inset_0_0_0_2px_#b8bdc3] active:shadow-[inset_0_0_0_2px_#b8bdc3] disabled:shadow-none disabled:text-gray-600":
        look === "ghost",
    },
    className
  );

  const textClassName = classNames(
    "w-full min-w-0 break-word",
    size === "large" ? "py-6" : "py-1"
  );

  const iconClassName = classNames(
    "fill-current flex-shrink-0",
    size === "large" ? "w-36 h-36" : "w-24 h-24",
    {
      "mr-8": iconLeft,
      "ml-8": iconRight,
    }
  );

  const iconLeftElement = iconLeft
    ? React.cloneElement(icon, { className: iconClassName })
    : null;

  const iconRightElement = iconRight
    ? React.cloneElement(iconRight, { className: iconClassName })
    : null;

  const iconOnlyElement = iconOnly
    ? React.cloneElement(icon, { className: iconClassName })
    : null;

  const restProps = isFakeDisabledButton ? { disabled: true } : rest;

  return (
    <Component className={buttonClassName} {...restProps}>
      {iconLeftElement}
      {children ? <div className={textClassName}>{children}</div> : ""}
      {iconRightElement}
      {iconOnlyElement}
    </Component>
  );
}

export default Button;
