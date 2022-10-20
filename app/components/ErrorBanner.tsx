import React, { ReactNode } from "react";
import ExclamationMark from "~/components/icons/mui/ExclamationMark";
import classNames from "classnames";
import SettingsOutlined from "~/components/icons/mui/SettingsOutlined";

type ErrorBannerProps = {
  heading?: ReactNode | string;
  children: ReactNode;
  style?: "error" | "warning";
  className?: string;
};

export default class ErrorBanner extends React.Component<ErrorBannerProps> {
  render() {
    const heading = this.props.heading;
    const style = this.props.style || "error";
    const IconComponent =
      style === "warning" ? SettingsOutlined : ExclamationMark;
    return (
      <div
        className={classNames(
          "border-l-[12px] pl-32 pr-32 py-20 flex flex-row gap-4",
          style === "warning"
            ? "bg-yellow-200 border-l-yellow-600"
            : "bg-red-200 border-l-red-900",
          this.props.className
        )}
      >
        <IconComponent className="mt-6 mr-10 min-w-[25px] text-red-900" />
        <div className="flex flex-col max-w-[55rem]" aria-live="polite">
          <div className="text-24 leading-30 mb-8">{heading}</div>
          <div className="text-16">{this.props.children}</div>
        </div>
      </div>
    );
  }
}
