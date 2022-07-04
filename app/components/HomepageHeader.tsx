import { TFunction, useTranslation } from "react-i18next";
import { Button, ContentContainer, TopNavigation } from "~/components/index";
import logo from "~/assets/images/logo.svg";
import classNames from "classnames";
import { ReactNode } from "react";
import LetterIcon from "~/components/icons/mui/LetterIcon";
import PersonCircle from "~/components/icons/mui/PersonCircle";

function HeaderLink({
  destination,
  icon,
  children,
}: {
  destination: string;
  icon?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="inline-flex py-8">
      {icon && <div className="mr-10 inline-flex">{icon}</div>}
      <a href={destination} className="text-14 uppercase tracking-1 font-bold">
        {children}
      </a>
    </div>
  );
}

function HeaderActions() {
  return (
    <>
      <HeaderLink
        destination="/anmelden"
        icon={<PersonCircle className="w-[20px] h-[20px]" />}
      >
        Anmelden
      </HeaderLink>
      <HeaderLink
        destination="/hilfe"
        icon={<LetterIcon className="w-[20px] h-[20px]" />}
      >
        Kontakt
      </HeaderLink>
      <HeaderLink destination="/barrierefreiheit">Barrierefreiheit</HeaderLink>
    </>
  );
}

function HeaderButtons({
  t,
  pruefenActive,
}: {
  t: TFunction<"all", "all">;
  pruefenActive?: boolean;
}) {
  return (
    <>
      <Button
        to="/pruefen/start"
        size="medium"
        look="tertiary"
        className={classNames("mb-16 text-center lg:mb-0 lg:mr-24", {
          hidden: pruefenActive,
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

export function HomepageHeader({ pruefenActive }: { pruefenActive?: boolean }) {
  const { t } = useTranslation("all");

  return (
    <div className="mb-32 md:mb-64 bg-white pb-24 lg:py-32">
      {/* Mobile Header */}
      <div className="lg:hidden inline-flex flex-col items-center w-full">
        <div className="mb-24 w-full">
          <TopNavigation
            actions={
              <div className="flex flex-col mb-32">
                <HeaderActions />
              </div>
            }
          />
        </div>
        <div className="flex flex-col max-w-[412px] w-full px-24">
          <HeaderButtons t={t} pruefenActive={pruefenActive} />
        </div>
      </div>
      {/* Desktop Header */}
      <div className="hidden lg:flex lg:flex-col">
        <ContentContainer className="w-full flex flex-col md:flex-row md:justify-between">
          <div className="hidden lg:inline-block">
            <a href="/" title="Zur Startseite">
              <img src={logo} alt="Grundsteuererklärung für Privateigentum" />
            </a>
          </div>
          <div className="flex flex-col">
            <div className="flex flex-row-reverse gap-x-32 mb-32">
              <HeaderActions />
            </div>
            <div className="flex justify-end">
              <HeaderButtons t={t} pruefenActive={pruefenActive} />
            </div>
          </div>
        </ContentContainer>
      </div>
    </div>
  );
}
