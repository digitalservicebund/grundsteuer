import { useTranslation } from "react-i18next";
import { Link } from "@remix-run/react";
import FloatButton from "~/components/FloatButton";
import LetterIcon from "~/components/icons/mui/LetterIcon";

export default function Footer() {
  const { t } = useTranslation("all");
  return (
    <footer className="flex-shrink-0 bg-white">
      <FloatButton
        size="small"
        className="invisible md:visible"
        look="secondary"
        floatingBorderBottom={82}
        icon={<LetterIcon />}
        to={"/hilfe"}
      >
        Können wir helfen?
      </FloatButton>
      <div className="visible md:hidden p-32 bg-blue-200 text-16 flex flex-wrap md:flex md:justify-between md:items-center ">
        <div className="flex items-center">
          {/*Put the thumbs up/down component here*/}
        </div>
        <div className="flex flex-wrap">
          <a href="/hilfe">
            Haben Sie Fragen? Sie können uns eine{" "}
            <span className="underline font-bold">Nachricht</span> schreiben.
          </a>
        </div>
      </div>
      <div className="px-16 md:px-32 lg:px-48">
        <div className="md:flex md:justify-between md:items-center gap-x-32 md:gap-x-64 pt-32">
          <div className="flex flex-col shrink-0 pb-56">
            <div className="flex flex-col md:flex-row mb-16 md:mb-0">
              <span>Im Auftrag des</span>
              <a
                href="https://www.bundesfinanzministerium.de"
                rel="noopener"
                target="_blank"
                className="text-blue-800 underline font-bold md:ml-4"
              >
                Bundesministerium für Finanzen
              </a>
            </div>
            <div className="flex flex-col md:flex-row">
              <span>Ein Online-Dienst des</span>
              <a
                href="https://digitalservice.bund.de"
                rel="noopener"
                target="_blank"
                className="text-blue-800 underline font-bold md:ml-4"
              >
                DigitalService GmbH
              </a>
            </div>
          </div>

          <div className="flex flex-wrap pb-16 md:justify-end gap-x-14 md:gap-x-32 max-w-[700px]">
            <Link
              to="/impressum"
              className="block pb-8 text-blue-800 uppercase text-14 leading-18 font-bold tracking-widest"
            >
              {t("footer.imprint")}
            </Link>
            <Link
              to="/nutzungsbedingungen"
              className="block pb-8 text-blue-800 uppercase text-14 leading-18 font-bold tracking-widest"
            >
              {t("footer.termsOfUse")}
            </Link>
            <Link
              to="/datenschutz"
              className="block pb-8 text-blue-800 uppercase text-14 leading-18 font-bold tracking-widest"
            >
              {t("footer.dataProtection")}
            </Link>
            <Link
              to="/barrierefreiheit"
              className="block pb-8 text-blue-800 uppercase text-14 leading-18 font-bold tracking-widest"
            >
              {t("footer.accessibility")}
            </Link>
            <a
              href="https://github.com/digitalservicebund/grundsteuer"
              target="_blank"
              className="block pb-8 text-blue-800 uppercase text-14 leading-18 font-bold tracking-widest"
            >
              {t("footer.openSource")}
            </a>
            <a
              href="https://digitalservice.bund.de/presse"
              target="_blank"
              className="block pb-8 text-blue-800 uppercase text-14 leading-18 font-bold tracking-widest"
            >
              {t("footer.press")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
