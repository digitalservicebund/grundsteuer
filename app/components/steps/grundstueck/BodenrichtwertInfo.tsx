import { StepComponentFunction } from "~/routes/formular/_step";
import { Button, ContentContainer } from "~/components";
import { ReactNode, SVGProps } from "react";
import Accordion from "~/components/Accordion";
import { useTranslation } from "react-i18next";
import { BBHelp } from "~/components/steps/grundstueck/bodenrichtwert/BBHelp";
import { BEHelp } from "~/components/steps/grundstueck/bodenrichtwert/BEHelp";
import { HBHelp } from "~/components/steps/grundstueck/bodenrichtwert/HBHelp";
import { MVHelp } from "~/components/steps/grundstueck/bodenrichtwert/MVHelp";

const BodenrichtwertInfo: StepComponentFunction = ({ allData, i18n }) => {
  const bundesland = allData.grundstueck?.adresse?.bundesland;
  return (
    <div className="mb-80">
      <ContentContainer size="sm-md" className="mb-80">
        <p className="mb-2 text-18">{i18n.specifics.explanation}</p>
        {i18n.specifics.portalUrl && (
          <PortalButton
            url={i18n.specifics.portalUrl}
            label={i18n.specifics.portalLabel}
            border={true}
            classNames={"mt-32"}
          />
        )}
        {bundesland === "HB" && (
          <p>
            Im{" "}
            <a
              href={i18n.specifics.geoviewerUrl}
              target="_blank"
              className="font-bold underline"
            >
              Flurstücksviewer Bremen
            </a>{" "}
            finden Sie weitere Angaben zu Gemarkung, Flur, Flurstück und
            Grundstücksgröße Ihres Grundstücks.
          </p>
        )}
      </ContentContainer>
      <div>
        <BodenrichtwertHelp bundesland={bundesland ? bundesland : "default"} />
      </div>
    </div>
  );
};

interface BodenrichtwertButtonProps {
  url: string;
  border: boolean;
  classNames: string;
  children?: ReactNode;
}

const BodenrichtwertButton = (props: BodenrichtwertButtonProps) => {
  return (
    <div className="mb-32">
      <Button
        size="large"
        look={props.border ? "tertiary" : "ghost"}
        href={props.url}
        target={"_blank"}
        icon={<PortalIcon />}
        className={props.classNames}
      >
        {props.children}
      </Button>
    </div>
  );
};

const PortalButton = (props: BodenrichtwertButtonProps & { label: string }) => {
  return (
    <BodenrichtwertButton
      border={props.border}
      classNames={props.classNames}
      url={props.url}
    >
      {props.label}
    </BodenrichtwertButton>
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
  const portalLabel = t(`${i18nPref}.${bundesland}.specifics.portalLabel`);
  const bundeslandName = t(`${i18nPref}.${bundesland}.specifics.bundesland`);

  return (
    <div className="mb-24">
      <p className="mb-8">Bodenrichtwertportal {bundeslandName}</p>
      <PortalButton
        url={portalUrl}
        label={portalLabel}
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
