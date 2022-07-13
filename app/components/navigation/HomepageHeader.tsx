import { TFunction, useTranslation } from "react-i18next";
import { Button, ContentContainer, TopNavigation } from "~/components";
import logo from "~/assets/images/logo.svg";
import classNames from "classnames";
import { ReactNode } from "react";
import PersonCircle from "~/components/icons/mui/PersonCircle";
import { useLocation } from "@remix-run/react";
import OpenTab from "~/components/icons/mui/OpenTab";

function HeaderLink({
  destination,
  icon,
  active,
  children,
}: {
  destination: string;
  icon?: ReactNode;
  active?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="inline-flex py-8">
      {icon && <div className="mr-10 inline-flex">{icon}</div>}
      <a
        href={destination}
        className={classNames("text-14 uppercase tracking-1 font-bold", {
          "underline text-blue-800": active,
        })}
      >
        {children}
      </a>
    </div>
  );
}

function HeaderActions({ location }: { location: string }) {
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
        destination="/hilfe"
        icon={<OpenTab className="w-[20px] h-[20px]" />}
        active={location.includes("/hilfe")}
      >
        Hilfebereich
      </HeaderLink>
    </>
  );
}

function HeaderButtons({
  t,
  location,
}: {
  t: TFunction<"all", "all">;
  location: string;
}) {
  return (
    <div className="flex flex-col lg:flex-row lg:justify-between lg:gap-x-64 max-w-[412px] lg:max-w-screen-xl w-full lg:max-w-auto px-24 lg:px-64 lg:mx-auto">
      <div className="mb-24 lg:mb-0 flex flex-col lg:flex-row">
        <div className="flex flex-row mb-16">
          <div className="mr-8 enumerate-icon inline-flex">1</div>
          <p className="inline-flex mr-16 lg:max-w-[180px]">
            Prüfen Sie, ob Sie den Service nutzen können.
          </p>
        </div>
        <Button
          to="/pruefen/start"
          size="medium"
          look="primary"
          className={classNames(
            "whitespace-nowrap w-full lg:w-[260px] h-fit lg:py-14",
            {
              hidden: location.includes("/pruefen"),
            }
          )}
        >
          {t("homepage.buttonCheck")}
        </Button>
      </div>
      <div className="flex flex-col lg:flex-row">
        <div className="flex flex-row mb-16">
          <div className="mr-8 enumerate-icon inline-flex">2</div>
          <p className="inline-flex mr-16 lg:max-w-[180px]">
            Gehen Sie dann in den Formularbereich.
          </p>
        </div>
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

export function HomepageHeader() {
  const { t } = useTranslation("all");
  const location = useLocation().pathname;

  return (
    <div>
      <div className="bg-white lg:py-32 lg:shadow-[0px_4px_10px_rgba(0,0,0,0.1)] lg:relative lg:z-10">
        {/* Mobile Header */}
        <div className="lg:hidden inline-flex flex-col items-center w-full">
          <div className="mb-24 w-full">
            <TopNavigation
              actions={
                <div className="flex flex-col mb-32">
                  <HeaderActions location={location} />
                </div>
              }
            />
          </div>
        </div>
        {/* Desktop Header */}
        <div className="hidden lg:flex lg:flex-col">
          <ContentContainer className="w-full flex flex-col md:flex-row md:justify-between">
            <div className="mt-16">
              <a href="/" title="Zur Startseite" className="flex">
                <img src={logo} alt="Grundsteuererklärung für Privateigentum" />
              </a>
            </div>
            <div className="flex flex-col">
              <div className="flex flex-row-reverse gap-x-32 mb-32">
                <HeaderActions location={location} />
              </div>
            </div>
          </ContentContainer>
        </div>
      </div>
      <div className="mb-32 md:mb-64 bg-white pb-24 lg:py-32 flex justify-center lg:justify-auto">
        <HeaderButtons t={t} location={location} />
      </div>
    </div>
  );
}
