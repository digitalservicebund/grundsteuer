import React from "react";
import classNames from "classnames";
import Clock from "~/components/Clock";
import { ContentContainer } from "~/components/index";

export default class DeadlineBanner extends React.Component<{
  className?: string;
}> {
  render() {
    const heading =
      "Abgabefrist für die Grundsteuererklärung ist der 31. Januar 2023";

    return (
      <div
        className={classNames(
          "pr-24 md:pr-32 py-20 bg-blue-300",
          this.props.className
        )}
        data-testid={"deadline-banner"}
      >
        <ContentContainer>
          <div className="flex flex-row gap-4 lg:ml-[-25px]">
            <Clock className="hidden md:block mr-10 min-w-[25px]" />
            <div
              className="flex flex-col max-w-[55rem] mt-16 ml-12"
              aria-live="polite"
            >
              <div className="text-24 leading-30 mb-8">{heading}</div>
              <div className="text-16">
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
