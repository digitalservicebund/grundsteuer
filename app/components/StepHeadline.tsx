import { Headline, IntroText } from "~/components";
import { I18nObject } from "~/i18n/getStepI18n";
import Hint from "~/components/Hint";
import { Trans } from "react-i18next";

export function StepHeadline({
  i18n,
  asLegend,
  isWeitereErklaerung,
  testFeaturesEnabled,
  isBruchteilsgemeinschaft,
}: {
  i18n: I18nObject;
  asLegend?: boolean;
  isWeitereErklaerung?: boolean;
  testFeaturesEnabled?: boolean;
  isBruchteilsgemeinschaft?: boolean;
}) {
  let headlineText = isWeitereErklaerung
    ? i18n.headlineWeitereErklaerung
    : i18n.headline;
  headlineText = isBruchteilsgemeinschaft
    ? i18n.headlineForBruchteilsgemeinschaft
    : headlineText;
  if (!testFeaturesEnabled && i18n.headlineOld) {
    headlineText = i18n.headlineOld;
  }

  return (
    <>
      <Headline asLegend={asLegend}>{headlineText}</Headline>
      {i18n.description && <IntroText>{i18n.description}</IntroText>}
      {i18n.hint && (
        <Hint>
          <Trans
            components={{
              bold: <strong />,
              underline: <p className="underline inline-block" />,
            }}
          >
            {i18n.hint}
          </Trans>
        </Hint>
      )}
    </>
  );
}
