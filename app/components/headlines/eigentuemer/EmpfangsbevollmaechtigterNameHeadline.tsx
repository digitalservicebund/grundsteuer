import { HeadlineComponentFunction } from "~/routes/formular/_step";
import { StepHeadline } from "~/components/StepHeadline";

const EmpfangsbevollmaechtigterNameHeadline: HeadlineComponentFunction = ({
  i18n,
  allData,
  asLegend,
  testFeaturesEnabled,
}) => {
  const isBruchteilsgemeinschaft =
    Number(allData?.eigentuemer?.anzahl?.anzahl) > 1;
  const headlineText =
    isBruchteilsgemeinschaft && testFeaturesEnabled
      ? i18n.alternativeHeadline
      : i18n.headline;
  const descriptionText =
    isBruchteilsgemeinschaft && testFeaturesEnabled
      ? i18n.alternativeDescription
      : undefined;

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
