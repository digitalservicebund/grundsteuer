import { StepComponentFunction } from "~/routes/formular/_step";
import { Button, ContentContainer } from "~/components";
import { ReactNode, SVGProps } from "react";
import Accordion from "~/components/Accordion";
import { useTranslation } from "react-i18next";
import berlin1 from "~/assets/images/boris/info-berlin-1.svg";
import berlin2 from "~/assets/images/boris/info-berlin-2.svg";
import berlin3 from "~/assets/images/boris/info-berlin-3.svg";
import berlin4 from "~/assets/images/boris/info-berlin-4.svg";
import berlin5 from "~/assets/images/boris/info-berlin-5.svg";
import bremen1 from "~/assets/images/boris/info-bremen-1.svg";
import bremen2 from "~/assets/images/boris/info-bremen-2.svg";
import EnumeratedCard from "~/components/EnumeratedCard";
import { I18nObject } from "~/i18n/getStepI18n";

const BodenrichtwertInfo: StepComponentFunction = ({ allData, i18n }) => {
  const bundesland = allData.grundstueck?.adresse?.bundesland;
  return (
    <div className="mb-80">
      <ContentContainer size="sm-md">
        <p className="mb-2">{i18n.specifics.explanation}</p>
        {i18n.specifics.portalUrl && (
          <PortalButton
            url={i18n.specifics.portalUrl}
            bundesland={i18n.specifics.bundesland}
            border={true}
            classNames={"mt-32"}
          />
        )}
      </ContentContainer>
      <div>
        <BodenrichtwertHelp
          i18n={i18n}
          bundesland={bundesland ? bundesland : "default"}
        />
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
    <div className="mb-80">
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

const PortalButton = (
  props: BodenrichtwertButtonProps & { bundesland: string }
) => {
  return (
    <BodenrichtwertButton
      border={props.border}
      classNames={props.classNames}
      url={props.url}
    >
      Zum Bodenrichtwert-Portal {props.bundesland}
    </BodenrichtwertButton>
  );
};

const GeoviewerButton = (
  props: BodenrichtwertButtonProps & { bundesland: string }
) => {
  return (
    <BodenrichtwertButton
      border={props.border}
      classNames={props.classNames}
      url={props.url}
    >
      Zum Geoviewer {props.bundesland}
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
  const bundeslandName = t(`${i18nPref}.${bundesland}.specifics.bundesland`);

  return (
    <div className="mb-24">
      <p className="mb-8">Bodenrichtwertportal {bundeslandName}</p>
      <PortalButton
        url={portalUrl}
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
      <h2 className="mb-32 text-24">Eine Schritt-für-Schritt Anleitung</h2>
      <div className={"mb-80"}>
        <EnumeratedCard
          image={berlin1}
          imageAltText="Screenshot vom Bodenrichtwert-Portal Berlin"
          number="1"
          heading="Externe Seite öffnen und Adresse eingeben"
          text="Öffnen Sie den oben stehenden Link um auf BORIS Berlin zu gelangen. Geben Sie im linken Bereich Ihre Adresse ein. Versuchen Sie verschiedene Schreibweisen. Meist reichen wenige Buchstaben des Straßennamens und ein Auswahlmenü mit Straßen wird angeboten. Wenn Sie die richtige Adresse gefunden haben bestätigen Sie die Auswahl per Klick auf den Button “Auf Karte anzeigen”."
          className="mb-16"
        />
        <EnumeratedCard
          image={berlin2}
          imageAltText="Screenshot vom Bodenrichtwert-Portal Berlin"
          number="2"
          heading="Adresse im Kartenausschnitt finden"
          text="Der Kartenausschnitt zeigt Ihr Grundstück und markiert dieses mit einem blassen, hellblauen Kreis. Der Kreis befindet sich innerhalb eines Bereichs, der durch eine rote gestrichelten Linie umrandet ist. Diese Linien ist die Bodenrichtwertzone für Ihr Grundstück. Hier können entweder ein oder mehrere Bodenrichtwerte angezeigt werden."
          className="mb-16"
        />
        <EnumeratedCard
          image={berlin3}
          imageAltText="Screenshot vom Bodenrichtwert-Portal Berlin"
          number="3"
          heading="Bodenrichtwert auswählen"
          text="Klicken Sie in der oberen Leiste auf das hellgrau hinterlegte “Bodenrichtwert auswählen”. Dann gehen Sie mit dem Mauszeiger auf den hellblauen Markierungskreis im Kartenausschnitt. Der Mauszeiger ist jetzt ein Fadenkreuz. Klicken Sie in den Markierungskreis bzw. auf Ihr gesuchtes Grundstück in der Karte."
          className="mb-16"
        />
        <EnumeratedCard
          image={berlin4}
          imageAltText="Screenshot vom Bodenrichtwert-Portal Berlin"
          number="4"
          heading="PDF erzeugen"
          text="Die entsprechende Bodenrichtwertzone sollte jetzt blau schraffiert hervorgehoben sein. Je nach Einsatz und Konfiguration des benutzen Browsers kann diese Darstellung auch ausbleiben. Links in der Ansicht finden Sie jetzt die graue Schaltfläche “PDF erzeugen”. Klicken Sie darauf und ein Dokument öffnet sich."
          className="mb-16"
        />
        <EnumeratedCard
          image={berlin5}
          imageAltText="Screenshot vom Bodenrichtwert-Portal Berlin"
          number="5"
          heading="Bodenrichtwert aus PDF entnehmen"
          text="Den Bodenrichtwert entnehmen Sie dem Dokument. Merken Sie sich diesen Wert für die Eingabe.
Wenn Sie zwei Bodenrichtwerte in dem PDF finden, wählen Sie auf der nächsten Seite “zwei Bodenrichtwerte” aus."
          className="mb-16"
        />
      </div>
    </>
  );
};

const HBHelp = ({ i18n }: { i18n: I18nObject }) => {
  return (
    <>
      <h2 className="mb-32 text-24">Eine Schritt-für-Schritt Anleitung</h2>
      <div className={"mb-80"}>
        <EnumeratedCard
          image={bremen1}
          imageAltText="Screenshot vom Bodenrichtwert-Portal Bremen"
          number="1"
          heading="Externe Seite öffnen und Adresse eingeben"
          text="Öffnen Sie den oben stehenden Link. Auf der Seite finden Sie oben eine Suchleiste. Geben Sie dort Ihre Adresse ein."
          className="mb-16"
        />
        <EnumeratedCard
          image={bremen2}
          imageAltText="Screenshot vom Bodenrichtwert-Portal Bremen"
          number="2"
          heading="Bodenrichtwert ablesen"
          text="Der Kartenausschnitt zeigt nun Ihr Grundstück und markiert die Stelle mit einem roten Symbol. Klicken Sie auf dieses Symbol. Rechts öffnet sich ein Bereich mit Informationen. Merken Sie sich den Wert von “Bodenrichtwert” für die Eingabe. Sie können das “Bodenrichtwert-Portal Bremen” nun verlassen."
          className="mb-16"
        />
      </div>

      <ContentContainer size="sm-md" className="mb-32">
        Für weitere Angaben zu Ihrem Grundstück finden sie unter diesem Link
        passende Informationen.
      </ContentContainer>

      <GeoviewerButton
        url={i18n.specifics.geoviewerUrl}
        bundesland={i18n.specifics.bundesland}
        border={true}
        classNames={"mt-16"}
      />
    </>
  );
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

export const BodenrichtwertHelp = ({
  i18n,
  bundesland,
}: {
  i18n: I18nObject;
  bundesland?: string;
}) => {
  switch (bundesland) {
    case "BB":
      return <BBHelp />;
    case "BE":
      return <BEHelp />;
    case "HB":
      return <HBHelp i18n={i18n} />;
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
