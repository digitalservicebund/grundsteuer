import { TFunction, useTranslation } from "react-i18next";
import { Button, ContentContainer, TopNavigation } from "~/components";
import logo from "~/assets/images/logo.svg";
import classNames from "classnames";
import { ReactNode } from "react";
import PersonCircle from "~/components/icons/mui/PersonCircle";
import { useLocation } from "@remix-run/react";
import OpenTab from "~/components/icons/mui/OpenTab";
import Redo from "~/components/icons/mui/Redo";
import EditWithPadding from "~/components/icons/mui/EditWithPadding";

function HeaderLink({
  destination,
  icon,
  active,
  children,
  newTab,
}: {
  destination: string;
  icon?: ReactNode;
  active?: boolean;
  children: ReactNode;
  newTab?: boolean;
}) {
  const newTabAttributes = newTab
    ? {
        target: "_blank",
      }
    : {};

  return (
    <div className="inline-flex py-8">
      {icon && <div className="mr-10 inline-flex items-center">{icon}</div>}
      <a
        href={destination}
        className={classNames("text-14 uppercase tracking-1 font-bold", {
          "underline text-blue-800": active,
        })}
        {...newTabAttributes}
      >
        {children}
      </a>
    </div>
  );
}

function HeaderActions({
  location,
  skipPruefen,
  showNewFeatures,
}: {
  location: string;
  showNewFeatures: boolean | undefined;
  skipPruefen?: boolean;
}) {
  const { t } = useTranslation("all");
  if (skipPruefen) {
    return (
      <Button
        look="ghost"
        size="large"
        icon={<Redo />}
        className="underline pl-0"
        to="/formular"
      >
        {t("homepage.skipPruefen")}
      </Button>
    );
  }
  if (showNewFeatures) {
    return (
      <Button
        look="ghost"
        size="large"
        icon={<EditWithPadding />}
        className="underline pl-0"
        to="/anmelden"
      >
        {t("homepage.continue.buttonText")}
      </Button>
    );
  } else {
    return (
      <>
        <HeaderLink
          destination="/anmelden"
          icon={<PersonCircle className="w-[20px] h-[20px]" />}
          active={location.includes("/anmelden")}
        >
          Anmelden
        </HeaderLink>
        <HeaderLink
          destination="https://grundsteuererklaerung-fuer-privateigentum.zammad.com/help/de-de"
          icon={<OpenTab className="w-[20px] h-[20px]" />}
          newTab
        >
          Hilfebereich
        </HeaderLink>
      </>
    );
  }
}

function HeaderButtons({
  t,
  location,
}: {
  t: TFunction<"all", "all">;
  location: string;
}) {
  const onPruefenPage = location.includes("/pruefen");
  return (
    <div
      className={classNames(
        "flex flex-col lg:flex-row lg:gap-x-64 max-w-[412px] lg:max-w-screen-xl w-full lg:max-w-auto px-24 lg:px-64 lg:mx-auto",
        {
          "lg:justify-center": onPruefenPage,
          "lg:justify-between": !onPruefenPage,
        }
      )}
    >
      <div
        className={classNames("mb-24 lg:mb-0 flex flex-col lg:flex-row", {
          hidden: onPruefenPage,
        })}
      >
        <div className="flex flex-row mb-16 lg:mb-0">
          <div className="mr-8 enumerate-icon inline-flex">1</div>
          <p className="inline-flex mr-16 text-18 lg:max-w-[180px]">
            Prüfen Sie, ob Sie den Service nutzen können.
          </p>
        </div>
        <Button
          to="/pruefen/start"
          size="medium"
          look="primary"
          className="whitespace-nowrap w-full lg:w-[260px] h-fit lg:py-14"
        >
          {t("homepage.buttonCheck")}
        </Button>
      </div>
      <div className="flex flex-col lg:flex-row">
        {onPruefenPage ? (
          <div className="mb-16 lg:mb-0">
            <p className="inline-flex mr-16 text-18 lg:max-w-[355px]">
              Prüfen Sie, ob sie den Service nutzen können. Gehen Sie dann in
              den Formularbereich.
            </p>
          </div>
        ) : (
          <div className="flex flex-row mb-16 lg:mb-0">
            <div className="mr-8 enumerate-icon inline-flex">2</div>
            <p className="inline-flex mr-16 text-18 lg:max-w-[180px]">
              Gehen Sie dann in den Formularbereich.
            </p>
          </div>
        )}
        <Button
          to="/formular/welcome"
          look="tertiary"
          size="medium"
          className="whitespace-nowrap w-full lg:w-[260px] h-fit lg:py-14"
        >
          {t("homepage.buttonStart")}
        </Button>
      </div>
    </div>
  );
}

export function HomepageHeader({
  skipPruefen,
  showNewFeatures,
}: {
  skipPruefen?: boolean;
  showNewFeatures?: boolean;
}) {
  const { t } = useTranslation("all");
  const location = useLocation().pathname;
  return (
    <div>
      <div className="bg-white lg:py-32 lg:shadow-[0px_4px_10px_rgba(0,0,0,0.1)] lg:relative lg:z-10">
        {/* Mobile Header */}
        <div className="lg:hidden inline-flex flex-col items-center w-full">
          <div className="w-full">
            <TopNavigation
              actions={
                <div className="flex flex-col mb-32">
                  <HeaderActions
                    location={location}
                    showNewFeatures={showNewFeatures}
                  />
                </div>
              }
            />
          </div>
        </div>
        {/* Desktop Header */}
        <div className="hidden lg:flex lg:flex-col">
          <ContentContainer className="w-full flex flex-col md:flex-row md:justify-between">
            <div>
              <a href="/" title="Zur Startseite" className="flex">
                <img src={logo} alt="Grundsteuererklärung für Privateigentum" />
              </a>
            </div>
            <div className="flex flex-col">
              <div className="flex flex-row-reverse gap-x-32">
                <HeaderActions
                  location={location}
                  skipPruefen={skipPruefen}
                  showNewFeatures={showNewFeatures}
                />
              </div>
            </div>
          </ContentContainer>
        </div>
      </div>
      {!showNewFeatures && (
        <div className="mb-32 md:mb-48 bg-white pb-24 lg:py-24 flex justify-center lg:justify-auto">
          <HeaderButtons t={t} location={location} />
        </div>
      )}
    </div>
  );
}
