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
    <>
      <Button
        to="/pruefen/start"
        size="medium"
        look="tertiary"
        className={classNames("mb-16 text-center lg:mb-0 lg:mr-24", {
          hidden: location.includes("/pruefen"),
        })}
      >
        {t("homepage.buttonCheck")}
      </Button>
      <Button to="/formular/welcome" size="medium">
        {t("homepage.buttonStart")}
      </Button>
    </>
  );
}

export function HomepageHeader() {
  const { t } = useTranslation("all");
  const location = useLocation().pathname;

  return (
    <div className="mb-32 md:mb-64 bg-white pb-24 lg:py-32">
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
        <div className="flex flex-col max-w-[412px] w-full px-24">
          <HeaderButtons t={t} location={location} />
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
            <div className="flex justify-end">
              <HeaderButtons t={t} location={location} />
            </div>
          </div>
        </ContentContainer>
      </div>
    </div>
  );
}
