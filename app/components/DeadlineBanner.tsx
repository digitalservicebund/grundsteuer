import React from "react";
import classNames from "classnames";
import ClockIcon from "~/assets/images/icon_clock.svg";
import { ContentContainer } from "~/components/index";

type DeadlineBannerProps = {
  size: "small" | "large";
  className?: string;
};

export default class DeadlineBanner extends React.Component<DeadlineBannerProps> {
  render() {
    const heading =
      "Abgabefrist für die Grundsteuererklärung ist der 31. Januar 2023";

    const headingClasses =
      this.props.size === "small"
        ? "text-24 leading-30 mb-6"
        : "text-28 leading-30 mb-20";

    const [width, height] =
      this.props.size === "small" ? ["47", "59"] : ["79", "97"];
    return (
      <div
        className={classNames(
          "pr-24 md:pr-32 py-20 bg-blue-300",
          this.props.className
        )}
        data-testid={"deadline-banner"}
      >
        <ContentContainer>
          <div className="flex flex-row items-center gap-4 lg:ml-[-25px]">
            <div className="hidden md:block mr-10">
              <img
                src={ClockIcon}
                alt={"Weißer Wecker mit blauem Display"}
                width={width}
                height={height}
              />
            </div>
            <div
              className="flex flex-col max-w-[55rem] ml-12"
              aria-live="polite"
            >
              <div className={headingClasses}>{heading}</div>
              <div className="text-16 leading-16">
                Weitere Informationen zur Abgabefrist erhalten Sie{" "}
                <a
                  href="https://grundsteuererklaerung-fuer-privateigentum.zammad.com/help/de-de/28-fragen-zur-abgabefrist-31-januar-2023"
                  className="underline text-blue-800"
                >
                  hier
                </a>
                .
              </div>
            </div>
          </div>
        </ContentContainer>
      </div>
    );
  }
}
