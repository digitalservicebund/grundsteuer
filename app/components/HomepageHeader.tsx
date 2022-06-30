import { useTranslation } from "react-i18next";
import { BmfLogo, Button } from "~/components/index";
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
  const pruefenButtonProps =
    loaderData?.env === "production"
      ? { disabled: true }
      : { to: "/pruefen/start" };

  return (
    <div className="mb-10 md:mb-48 lg:mb-36 flex flex-col md:flex-row-reverse md:justify-between">
      <div className="flex justify-center mb-40 md:block">
        <div className="lg:hidden inline-flex flex-col md:flex-row md:pt-32">
          <Button
            size="medium"
            look="tertiary"
            disabled
            className={classNames("mb-16 text-center md:mb-0 md:mr-24", {
              "bg-blue-200 shadow-none": pruefenActive,
            })}
            {...pruefenButtonProps}
          >
            {t("homepage.buttonCheck")}
          </Button>
          <Button size="medium" {...startButtonProps}>
            {t("homepage.buttonStart")}
          </Button>
        </div>
        <div className="hidden lg:block pt-16">
          <Button
            look="tertiary"
            disabled
            className={classNames("mr-24", {
              "bg-blue-200 shadow-none": pruefenActive,
            })}
            {...pruefenButtonProps}
          >
            {t("homepage.buttonCheck")}
          </Button>
          <Button {...startButtonProps}>{t("homepage.buttonStart")}</Button>
        </div>
      </div>
      <div>
        <a href="/" title="Zur Startseite">
          <BmfLogo />
        </a>
      </div>
    </div>
  );
}
