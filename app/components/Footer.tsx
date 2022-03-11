import { useTranslation } from "react-i18next";
import { Link } from "remix";
import digitalserviceLogoImage from "~/assets/images/digitalservice-logo.svg";

export default function Footer() {
  const { t } = useTranslation("all");
  return (
    <footer className="flex-shrink-0 bg-gray-600">
      <div className="relative max-w-screen-2xl mx-auto">
        <div className="max-w-screen-xl mx-auto pb-80 pt-32 px-16 md:pb-12 md:px-32 md:pt-12 lg:px-64">
          <ul>
            <li className="mb-8 md:mb-0 md:mr-40 md:inline-block">
              <Link
                to="/datenschutz"
                className="text-black text-18 leading-26 hover:underline focus:underline"
              >
                {t("footer.privacyProtection")}
              </Link>
            </li>
            <li className="md:inline-block">
              <Link
                to="/impressum"
                className="text-black text-18 leading-26 hover:underline"
              >
                {t("footer.imprint")}
              </Link>
            </li>
          </ul>
        </div>
        <a
          href="https://digitalservice.bund.de"
          rel="noopener"
          target="_blank"
          className="absolute right-16 bottom-0 md:right-32 lg:right-64"
        >
          <img src={digitalserviceLogoImage} alt={t("footer.digitalservice")} />
        </a>
      </div>
    </footer>
  );
}
