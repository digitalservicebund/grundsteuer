import { useTranslation } from "react-i18next";
import { Button, ContentContainer } from "~/components/index";
import logo from "~/assets/images/logo.svg";
import classNames from "classnames";

export function HomepageHeader({
  loaderData,
  pruefenActive,
}: {
  loaderData: { env: string };
  pruefenActive?: boolean;
}) {
  const { t } = useTranslation("all");
  // buttons in production are temporarily disabled until full launch
  // (implementation note: cannot pass props "disabled" and "to" at the same time)
  const startButtonProps =
    loaderData?.env === "production"
      ? { disabled: true }
      : { to: "/formular/welcome" };
  const pruefenButtonProps = { to: "/pruefen/start" };

  return (
    <div className="mb-32 md:mb-64 bg-white py-32">
      <ContentContainer className="w-full flex flex-col md:flex-row md:justify-between">
        <div className="inline-block">
          <a href="/" title="Zur Startseite">
            <img src={logo} alt="Grundsteuererklärung für Privateigentum" />
          </a>
        </div>
        <div className="inline-block">
          <div className="flex justify-center md:block">
            <div className="lg:hidden inline-flex flex-col md:flex-row md:pt-32 mt-32">
              <Button
                size="medium"
                look="tertiary"
                disabled
                className={classNames("mb-16 text-center md:mb-0 md:mr-24", {
                  hidden: pruefenActive,
                })}
                {...pruefenButtonProps}
              >
                {t("homepage.buttonCheck")}
              </Button>
              <Button size="medium" {...startButtonProps}>
                {t("homepage.buttonStart")}
              </Button>
            </div>
            <div className="hidden lg:block">
              <Button
                look="tertiary"
                disabled
                className={classNames("mr-24", {
                  hidden: pruefenActive,
                })}
                {...pruefenButtonProps}
              >
                {t("homepage.buttonCheck")}
              </Button>
              <Button {...startButtonProps}>{t("homepage.buttonStart")}</Button>
            </div>
          </div>
        </div>
      </ContentContainer>
    </div>
  );
}
