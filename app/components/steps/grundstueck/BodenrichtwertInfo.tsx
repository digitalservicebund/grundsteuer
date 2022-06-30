import { StepComponentFunction } from "~/routes/formular/_step";
import { ContentContainer } from "~/components";
import Accordion from "~/components/Accordion";
import { useTranslation } from "react-i18next";
import { BBHelp } from "~/components/steps/grundstueck/bodenrichtwert/BBHelp";
import { BEHelp } from "~/components/steps/grundstueck/bodenrichtwert/BEHelp";
import { HBHelp } from "~/components/steps/grundstueck/bodenrichtwert/HBHelp";
import { MVHelp } from "~/components/steps/grundstueck/bodenrichtwert/MVHelp";
import { NWHelp } from "~/components/steps/grundstueck/bodenrichtwert/NWHelp";
import { RPHelp } from "~/components/steps/grundstueck/bodenrichtwert/RPHelp";
import { SHHelp } from "~/components/steps/grundstueck/bodenrichtwert/SHHelp";
import { SLHelp } from "~/components/steps/grundstueck/bodenrichtwert/SLHelp";
import { SNHelp } from "~/components/steps/grundstueck/bodenrichtwert/SNHelp";
import { STHelp } from "~/components/steps/grundstueck/bodenrichtwert/STHelp";
import { ExternalLinkButton } from "~/components/ExternalLinkButton";

const BodenrichtwertInfo: StepComponentFunction = ({ allData, i18n }) => {
  const bundesland = allData.grundstueck?.adresse?.bundesland;
  return (
    <div className="mb-80">
      <ContentContainer size="sm-md" className="mb-80">
        <p className="mb-2 text-18">{i18n.specifics.explanation}</p>
        {i18n.specifics.portalUrl && (
          <ExternalLinkButton
            url={i18n.specifics.portalUrl}
            border={true}
            classNames={"mt-32"}
          >
            {i18n.specifics.portalLabel}
          </ExternalLinkButton>
        )}
        {bundesland === "HB" && (
          <p className="mt-64">
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
      <ContentContainer size="lg">
        <BodenrichtwertHelp bundesland={bundesland ? bundesland : "default"} />
      </ContentContainer>
    </div>
  );
};

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
      <ExternalLinkButton
        url={portalUrl}
        border={false}
        classNames={"mt-8 pl-0"}
      >
        {portalLabel}
      </ExternalLinkButton>
    </div>
  );
};

const DefaultHelp = () => {
  return <DefaultBodenrichtwertPortalLinks />;
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
