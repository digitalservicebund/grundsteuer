import { HeadlineComponentFunction } from "~/routes/formular/_step";
import { StepHeadline } from "~/components/StepHeadline";
import { conditions } from "~/domain/guards";

const EmpfangsbevollmaechtigterNameHeadline: HeadlineComponentFunction = ({
  i18n,
  allData,
  asLegend,
  testFeaturesEnabled,
}) => {
  let headlineText = i18n.headline;
  let descriptionText = i18n.description;
  if (conditions.isBruchteilsgemeinschaft(allData) && testFeaturesEnabled) {
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

export default EmpfangsbevollmaechtigterNameHeadline;
