import { StepComponentFunction } from "~/routes/formular/_step";
import { ContentContainer } from "~/components";
import { BBHelp } from "~/components/steps/grundstueck/bodenrichtwert/BBHelp";
import { BEHelp } from "~/components/steps/grundstueck/bodenrichtwert/BEHelp";
import { DefaultHelp } from "~/components/steps/grundstueck/bodenrichtwert/DefaultHelp";
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
        {i18n.specifics.explanation && (
          <p className="text-18 mb-32">{i18n.specifics.explanation}</p>
        )}
        {i18n.specifics.portalUrl && (
          <ExternalLinkButton url={i18n.specifics.portalUrl} border={true}>
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
      <ContentContainer size={bundesland ? "lg" : "md"}>
        <BodenrichtwertHelp bundesland={bundesland ? bundesland : "default"} />
      </ContentContainer>
    </div>
  );
};

const THHelp = () => {
  return <></>;
};

const BodenrichtwertHelp = ({ bundesland }: { bundesland?: string }) => {
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
    case "default":
    default:
      return <DefaultHelp />;
  }
};

export default BodenrichtwertInfo;
