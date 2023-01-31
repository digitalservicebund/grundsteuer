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
              Die Frist zur Abgabe der Grundsteuererklärung ist abgelaufen
            </div>
            <div className="text-16 max-w-[35rem]">
              Die Abgabefrist für die Grundsteuererklärung endete am 31. Januar
              2023. Bitte geben Sie Ihre Erklärung noch schnellstmöglich ab. Der
              Online-Dienst ist weiterhin für Sie verfügbar. Weitere
              Informationen dazu finden Sie in{" "}
              <a
                href="https://grundsteuererklaerung-fuer-privateigentum.zammad.com/help/de-de/28-fragen-zur-abgabefrist-31-januar-2023"
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
