import UhrIcon from "~/assets/images/icon_uhr.svg";
import { ContentContainer } from "~/components/index";
import React from "react";
import classNames from "classnames";

export default function DeadlineBanner(props: { homepage?: boolean }) {
  const containerClasses = classNames(
    "bg-white pr-24 md:pr-32 border-gray-600",
    props.homepage ? "border-t-2 py-48" : "border-b-2 py-24"
  );
  const iconClasses = classNames(
    "hidden md:block",
    props.homepage ? "max-h-128" : "max-h-112"
  );

  return (
    <div className={containerClasses} data-testid={"deadline-banner"}>
      <ContentContainer>
        <div className="flex flex-row items-center md:gap-64">
          <div>
            <img
              src={UhrIcon}
              alt="Eine Uhr"
              className={iconClasses}
              loading="lazy"
            />
          </div>
          <div aria-live="polite">
            <div className="text-24 leading-30 mb-8">
              Dieser Service wird am 31. August 2023 eingestellt.
            </div>
            <div className="text-16 max-w-[35rem]">
              Bis dahin haben Sie noch die Möglichkeit unseren Online-Dienst zu
              nutzen. Weitere Informationen dazu finden Sie in{" "}
              <a
                href="https://grundsteuererklaerung-fuer-privateigentum.zammad.com/help/de-de/71"
                className="font-bold text-blue-800 underline"
              >
                unserem Hilfebereich
              </a>
              .
            </div>
          </div>
        </div>
      </ContentContainer>
    </div>
  );
}
