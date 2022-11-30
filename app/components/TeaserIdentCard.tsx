import ClockIcon from "~/assets/images/icon_clock.svg";
import classNames from "classnames";
import { ContentContainer } from "~/components/index";

export default function TeaserIdentCard(props: { className?: string }) {
  return (
    <div
      className={classNames(
        "rounded-t-lg !bg-blue-800 text-white lg:text-black mt-48 lg:mt-0 p-16 lg:py-24 lg:px-32 lg:!bg-blue-300 lg:enumerate-card flex flex-col lg:flex-row max-w-[970px]",
        props.className
      )}
    >
      <div className="flex flex-row">
        <img
          src={ClockIcon}
          alt={"Weißer Wecker mit blauem Display"}
          className="h-[42px] lg:flex mr-16 lg:mr-36 lg:h-auto lg:w-full"
        />
        <div className="flex items-center">
          <p className="text-18 lg:hidden inline-block align-middle">
            <strong>Abgabefrist ist der 31.01.2023.</strong>
          </p>
        </div>
      </div>

      <div className="lg:flex lg:flex-col">
        <ContentContainer size="sm-md">
          <div className="mt-16 lg:mt-0">
            <p className="mb-24 lg:mb-8 text-18">
              <strong className="hidden lg:inline">
                Abgabefrist ist der 31.01.2023.
              </strong>{" "}
              Für die Option Identifikation mit Freischaltcode diesen jetzt
              beantragen, damit er noch rechtzeitg vor Abgabefrist per Post
              zugestellt werden kann.
            </p>
          </div>
        </ContentContainer>
      </div>
    </div>
  );
}
