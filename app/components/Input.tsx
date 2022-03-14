import React from "react";
import classNames from "classnames";

export interface InputProps extends React.ComponentPropsWithoutRef<"input"> {
  /** small input field */
  small?: boolean;
  /** very small input field */
  tiny?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { small, tiny, className } = props;
  return (
    <input
      {...props}
      ref={ref}
      className={classNames(
        "block w-full",
        "bg-white text-black",
        "border-2 border-darkGrey-1000",
        "hover:border-dustyGrey",
        "focus:border-darkGrey-900 focus:outline focus:outline-4 focus:outline-darkGreen",
        "disabled:text-darkGrey-800 disabled:border-darkGrey-400",
        {
          "px-3.5 py-4 text-lg leading-7": !small && !tiny,
          "px-3.5 py-3 text-base leading-5": small,
          "px-3.5 py-2 text-sm leading-5": tiny,
        },
        className
      )}
    />
  );
});

export default Input;
