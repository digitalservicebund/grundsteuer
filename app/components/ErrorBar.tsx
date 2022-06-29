import React, { ReactNode, createRef } from "react";
import ExclamationMark from "~/components/icons/mui/ExclamationMark";
import classNames from "classnames";

type ErrorBarProps = {
  heading?: ReactNode | string;
  children: ReactNode;
  className?: string;
};

export default class ErrorBar extends React.Component<ErrorBarProps> {
  private rootRef = createRef<HTMLDivElement>();

  componentDidMount() {
    this.rootRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  render() {
    const heading = this.props.heading || "Hinweis";
    return (
      <div
        ref={this.rootRef}
        className={classNames(
          "bg-red-200 border-l-[8px] border-l-red-900 pl-16 pr-32 py-16 mb-8 flex flex-row",
          this.props.className
        )}
      >
        <ExclamationMark className="mr-10 min-w-[20px] text-red-900" />
        <div className="flex flex-col">
          <strong>{heading}</strong>
          {this.props.children}
        </div>
      </div>
    );
  }
}
