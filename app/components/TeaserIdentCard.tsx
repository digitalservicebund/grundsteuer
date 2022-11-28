import ClockIcon from "~/assets/images/icon_clock.svg";
import classNames from "classnames";
import { ContentContainer } from "~/components/index";

export default function TeaserIdentCard(props: { className?: string }) {
  return (
    <div
      className={classNames(
        "mt-48 md:mt-0 p-16 lg:py-24 lg:px-32 !bg-blue-300 lg:enumerate-card flex-col lg:flex-row max-w-[970px]",
        props.className
      )}
    >
      <img
        src={ClockIcon}
        alt={"Weißer Wekcer mit blauem Display"}
        className="hidden lg:flex mr-36 md:h-[87px] md:w-[71px] w-full"
      />
      <div className="flex flex-col">
        <ContentContainer size="sm-md">
          <div className="flex flex-row mt-16 md:mt-0">
            <p className="mb-8 text-18">
              <strong>Abgabefrist ist der 31.01.2023.</strong> Für die Option
              Identifikation mit Freischaltcode diesen jetzt beantragen, damit
              er noch rechtzeitg vor Abgabefrist per Post zugestellt werden
              kann.
            </p>
          </div>
        </ContentContainer>
      </div>
    </div>
  );
}
