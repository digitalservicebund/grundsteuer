import { useTranslation } from "react-i18next";
import {
  Button,
  ContentContainer,
  LogoutButton,
  NavigationActions,
  NavigationLink,
  TopNavigation,
} from "~/components";
import logo from "~/assets/images/logo.svg";
import { useLocation } from "@remix-run/react";
import Redo from "~/components/icons/mui/Redo";
import Edit from "~/components/icons/mui/Edit";
import { UserLoggedIn } from "../UserLoggedIn";

function HeaderActions({
  skipPruefen,
}: {
  location: string;
  skipPruefen?: boolean;
  email?: string;
}) {
  const { t } = useTranslation("all");
  if (skipPruefen) {
    return (
      <Button
        look="ghost"
        size="small"
        icon={<Redo />}
        className="underline"
        to="/formular"
      >
        {t("homepage.skipPruefen")}
      </Button>
    );
  }
  return (
    <Button
      look="ghost"
      size="small"
      icon={<Edit />}
      className="underline"
      to="/anmelden"
    >
      {t("homepage.continue.buttonText")}
    </Button>
  );
}

export function HomepageHeader({
  skipPruefen,
  email,
}: {
  skipPruefen?: boolean;
  email?: string;
}) {
  const location = useLocation().pathname;
  return (
    <div>
      <header className="flex-shrink-0 bg-white lg:hidden">
        <TopNavigation
          actions={<NavigationActions email={email} formularLink />}
        ></TopNavigation>
      </header>

      <div className="bg-white lg:shadow-[0px_4px_10px_rgba(0,0,0,0.1)] lg:relative lg:z-10">
        {/* Desktop Header */}
        <div className="hidden lg:flex lg:flex-col">
          <ContentContainer className="w-full flex flex-col md:flex-row md:justify-between">
            <div className="lg:py-32">
              <a href="/" title="Zur Startseite" className="flex">
                <img src={logo} alt="Grundsteuererklärung für Privateigentum" />
              </a>
            </div>
            {!email ? (
              <div className="flex flex-col justify-center">
                <div className="flex flex-row-reverse gap-x-32">
                  <HeaderActions
                    location={location}
                    skipPruefen={skipPruefen}
                  />
                </div>
              </div>
            ) : (
              ""
            )}
            {email && (
              <div className="flex flex-col items-end">
                <UserLoggedIn email={email} />
                <div className="flex pt-16">
                  <NavigationLink
                    to="/formular"
                    icon={<Edit className="w-24 h-24 fill-blue-800" />}
                    isAllCaps
                  >
                    Zum Formular
                  </NavigationLink>
                  <LogoutButton />
                </div>
              </div>
            )}
          </ContentContainer>
        </div>
      </div>
    </div>
  );
}
