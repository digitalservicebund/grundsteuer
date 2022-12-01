import { HeadlineComponentFunction } from "~/routes/formular/_step";
import { StepHeadline } from "~/components/StepHeadline";

const FlurstueckAngabenHeadline: HeadlineComponentFunction = ({
  i18n,
  allData,
  asLegend,
}) => {
  const haustyp = allData.grundstueck?.haustyp?.haustyp;

  const shouldDisplayGrundbuchblattnummer =
    haustyp !== "wohnungseigentum" ||
    allData.grundstueck?.miteigentumAuswahlWohnung?.miteigentumTyp === "mixed";

  const headlineText = shouldDisplayGrundbuchblattnummer
    ? i18n.headline
    : i18n.alternativeHeadline;

  const descriptionText = shouldDisplayGrundbuchblattnummer
    ? i18n.description
    : i18n.alternativeDescription;

  return (
    <StepHeadline
      i18n={i18n}
      headlineText={headlineText}
      asLegend={asLegend}
      descriptionText={descriptionText}
    />
  );
};

export default FlurstueckAngabenHeadline;
