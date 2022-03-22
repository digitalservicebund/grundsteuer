import { useTranslation } from "react-i18next";
import { Link } from "remix";
import { ContentContainer } from "~/components";
import bmfLogoImage from "~/assets/images/bmf-logo.png";
import digitalserviceLogoImage from "~/assets/images/digitalservice-logo.svg";

export default function Footer() {
  const { t } = useTranslation("all");
  return (
    <footer className="flex-shrink-0 bg-white">
      <div className="px-16 md:px-32 lg:px-48">
        <div className="md:flex md:justify-between md:items-center pt-16 md:pt-0">
          <div className="relative -left-16 flex items-center">
            <a
              href="https://www.bundesfinanzministerium.de"
              rel="noopener"
              target="_blank"
            >
              <img
                src={bmfLogoImage}
                alt={t("footer.bmf")}
                className="w-[152px]"
              />
            </a>
            <a
              href="https://digitalservice.bund.de"
              rel="noopener"
              target="_blank"
            >
              <img
                src={digitalserviceLogoImage}
                alt={t("footer.digitalservice")}
                className="w-[70px] h-[70px]"
              />
            </a>
          </div>

          <div className="pb-16">
            <ul>
              <li className="mb-8 md:mb-0 mr-14 md:mr-32 inline-block">
                <Link
                  to="/impressum"
                  className="text-blue-800 uppercase text-14 leading-18 font-bold underline"
                >
                  {t("footer.imprint")}
                </Link>
              </li>
              <li className="mb-8 md:mb-0 inline-block">
                <Link
                  to="/datenschutz"
                  className="text-blue-800 uppercase text-14 leading-18 font-bold underline"
                >
                  {t("footer.dataProtection")}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
