import { HeadlineComponentFunction } from "~/routes/formular/_step";
import { StepHeadline } from "~/components/StepHeadline";
import { conditions } from "~/domain/states/guards";

const FlurstueckAngabenHeadline: HeadlineComponentFunction = ({
  i18n,
  allData,
  asLegend,
}) => {
  const typ = allData.grundstueck?.typ?.typ;

  const shouldDisplayGrundbuchblattnummer =
    typ !== "wohnungseigentum" ||
    allData.grundstueck?.miteigentumAuswahlWohnung?.miteigentumTyp === "mixed";

  let headlineText = shouldDisplayGrundbuchblattnummer
    ? i18n.headline
    : i18n.alternativeHeadline;
  let descriptionText = i18n.description;
  if (conditions.isBruchteilsgemeinschaft(allData)) {
    headlineText = i18n.alternativeHeadline || headlineText;
    descriptionText = i18n.alternativeDescription || descriptionText;
  }

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
