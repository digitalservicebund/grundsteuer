import { StepComponentFunction } from "~/routes/formular/_step";
import { Button } from "~/components";
import { SVGProps } from "react";

const BodenrichtwertInfo: StepComponentFunction = ({ allData, i18n }) => {
  const bundesland = allData.grundstueck?.adresse?.bundesland;
  return (
    <div>
      <div className="mb-16">
        <p className="mb-2">{i18n.specifics.explanation}</p>
        <Button
          size="large"
          look="tertiary"
          href={i18n.specifics.portalUrl}
          icon={<BodenrichtwertPortal />}
          className="mt-16"
        >
          {i18n.specifics.portalDesc}
        </Button>
        <div>
          <h2 className="mt-32 font-bold">{i18n.common.anleitung}</h2>
          <BodenrichtwertHelp
            bundesland={bundesland ? bundesland : "default"}
          />
        </div>
      </div>
    </div>
  );
};

const BodenrichtwertPortal = (props: SVGProps<SVGSVGElement>) => (
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

const DefaultHelp = () => {
  return <></>;
};

const BBHelp = () => {
  return <></>;
};

const BEHelp = () => {
  return (
    <ol className="list-decimal">
      <li>
        Öffnen Sie die Seite und geben sie im unteren linken Bereich ihre
        Adresse ein. Tipp: Kürzen sie Ihren Straßennamen durch “str” ohne Punkt
        ab: <span className="font-italic">Gärtnerstraße = Gärtnerstr</span>
      </li>
      <li>
        Die Karte passt sich danach an und Sie finden einen hellen blauen Kreis,
        der Ihre eingegebene Adresse markiert. Der Kreis befindet sich innerhalb
        einer Fläche die durch eine rote gestrichelten Linie umrandet ist. Das
        ist die Bodenrichtwertzone für ihr Grundstück.
      </li>
      <li>
        Von den Angaben in großer roter Schrift übernehmen sie bitte den ersten
        unterstrichenenden Zahlenwert. Das ist ihr Bodenrichtwert in Euro pro
        Quadratmeter.
      </li>
    </ol>
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
