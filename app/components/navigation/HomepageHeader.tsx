import { useTranslation } from "react-i18next";
import { Button, ContentContainer, TopNavigation } from "~/components";
import logo from "~/assets/images/logo.svg";
import { useLocation } from "@remix-run/react";
import Redo from "~/components/icons/mui/Redo";
import Edit from "~/components/icons/mui/Edit";

function HeaderActions({
  skipPruefen,
}: {
  location: string;
  skipPruefen?: boolean;
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

export function HomepageHeader({ skipPruefen }: { skipPruefen?: boolean }) {
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
                  <HeaderActions location={location} />
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
            <div className="flex flex-col justify-center">
              <div className="flex flex-row-reverse gap-x-32">
                <HeaderActions location={location} skipPruefen={skipPruefen} />
              </div>
            </div>
          </ContentContainer>
        </div>
      </div>
    </div>
  );
}
