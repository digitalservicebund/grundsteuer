import { StepComponentFunction } from "~/routes/formular/_step";
import { Button } from "~/components";
import { SVGProps } from "react";
import Accordion from "~/components/Accordion";
import { useTranslation } from "react-i18next";

const BodenrichtwertInfo: StepComponentFunction = ({ allData, i18n }) => {
  const bundesland = allData.grundstueck?.adresse?.bundesland;
  return (
    <div>
      <div className="mb-16">
        <p className="mb-2">{i18n.specifics.explanation}</p>
        {i18n.specifics.portalUrl && (
          <PortalButton
            portalUrl={i18n.specifics.portalUrl}
            bundesland={i18n.specifics.bundesland}
            border={true}
            classNames={"mt-16"}
          />
        )}
        <div>
          <BodenrichtwertHelp
            bundesland={bundesland ? bundesland : "default"}
          />
        </div>
      </div>
    </div>
  );
};

interface PortalButtonProps {
  portalUrl: string;
  bundesland: string;
  border: boolean;
  classNames: string;
}

const PortalButton = (props: PortalButtonProps) => {
  return (
    <Button
      size="large"
      look={props.border ? "tertiary" : "ghost"}
      href={props.portalUrl}
      target={"_blank"}
      icon={<PortalIcon />}
      className={props.classNames}
    >
      Zum Bodenrichtwert-Portal {props.bundesland}
    </Button>
  );
};

const PortalIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    viewBox="0 0 30 22"
    fill="none"
    {...props}
  >
    <path
      d="M19.5 0.335938L17.385 2.45094L24.255 9.33594H0V12.3359H24.255L17.37 19.2209L19.5 21.3359L30 10.8359L19.5 0.335938Z"
      fill="#004B76"
    />
  </svg>
);

export default BodenrichtwertInfo;

const DefaultBodenrichtwertPortalLinks = () => {
  const items = [
    {
      header: "Links zu länderspezifischen Bodenrichtwert-Portalen",
      content: (
        <>
          <PortalLink bundesland="bb" />
          <PortalLink bundesland="be" />
          <PortalLink bundesland="hb" />
          <PortalLink bundesland="mv" />
          <PortalLink bundesland="nw" />
          <PortalLink bundesland="rp" />
          <PortalLink bundesland="sh" />
          <PortalLink bundesland="sl" />
          <PortalLink bundesland="sn" />
          <PortalLink bundesland="st" />
          <PortalLink bundesland="th" />
        </>
      ),
    },
  ];

  return <Accordion {...{ items, boldAppearance: true }} />;
};

const PortalLink = ({ bundesland }: { bundesland: string }) => {
  const { t } = useTranslation();

  const i18nPref = "grundstueck.bodenrichtwertInfo";
  const portalUrl = t(`${i18nPref}.${bundesland}.specifics.portalUrl`);
  const bundeslandName = t(`${i18nPref}.${bundesland}.specifics.bundesland`);

  return (
    <div className="mb-24">
      <p className="mb-8">Bodenrichtwertportal {bundeslandName}</p>
      <PortalButton
        portalUrl={portalUrl}
        bundesland={bundeslandName}
        border={false}
        classNames={"mt-8 pl-0"}
      />
    </div>
  );
};

const DefaultHelp = () => {
  return (
    <>
      <p className="mb-16">
        Wenn sie zuerst Ihre Grundstücksadresse eingeben, können wir Ihnen
        gezielte Hilfestellungen zur Ermittlung des Bodenrichtswerts geben. Dann
        erhalten Sie an dieser Stelle passende Links und Informationen, die auf
        ihr Bundesland zugeschnitten sind.
      </p>
      <p className="mb-16">
        Vielleicht haben Sie auch ein Informationsschreiben aus Ihrem Bundesland
        erhalten, dann können Sie die Daten zu Ihrem Bodenrichtwert dort ablesen
        und auf der nächsten Seite eintragen. Wenn nicht, schauen Sie bitte auf
        die Webseiten zur Ermittlung der Bodenrichtwerte.
      </p>

      <DefaultBodenrichtwertPortalLinks />
    </>
  );
};

const BBHelp = () => {
  return <></>;
};

const BEHelp = () => {
  return (
    <>
      <h2 className="mt-32 font-bold">Eine Schritt für Schritt Anleitung</h2>
      <ol className="list-decimal">
        <li>
          Öffnen Sie die Seite und geben sie im unteren linken Bereich ihre
          Adresse ein. Tipp: Kürzen sie Ihren Straßennamen durch “str” ohne
          Punkt ab:{" "}
          <span className="font-italic">Gärtnerstraße = Gärtnerstr</span>
        </li>
        <li>
          Die Karte passt sich danach an und Sie finden einen hellen blauen
          Kreis, der Ihre eingegebene Adresse markiert. Der Kreis befindet sich
          innerhalb einer Fläche die durch eine rote gestrichelten Linie
          umrandet ist. Das ist die Bodenrichtwertzone für ihr Grundstück.
        </li>
        <li>
          Von den Angaben in großer roter Schrift übernehmen sie bitte den
          ersten unterstrichenenden Zahlenwert. Das ist ihr Bodenrichtwert in
          Euro pro Quadratmeter.
        </li>
      </ol>
    </>
  );
};

const HBHelp = () => {
  return <></>;
};

const MVHelp = () => {
  return <></>;
};

const NWHelp = () => {
  return <></>;
};

const RPHelp = () => {
  return <></>;
};

const SHHelp = () => {
  return <></>;
};

const SLHelp = () => {
  return <></>;
};

const SNHelp = () => {
  return <></>;
};

const STHelp = () => {
  return <></>;
};

const THHelp = () => {
  return <></>;
};

export const BodenrichtwertHelp = ({ bundesland }: { bundesland?: string }) => {
  switch (bundesland) {
    case "BB":
      return <BBHelp />;
    case "BE":
      return <BEHelp />;
    case "HB":
      return <HBHelp />;
    case "MV":
      return <MVHelp />;
    case "NW":
      return <NWHelp />;
    case "RP":
      return <RPHelp />;
    case "SH":
      return <SHHelp />;
    case "SL":
      return <SLHelp />;
    case "SN":
      return <SNHelp />;
    case "ST":
      return <STHelp />;
    case "TH":
      return <THHelp />;
    default:
      return <DefaultHelp />;
  }
};
