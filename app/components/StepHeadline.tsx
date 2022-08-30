import { Headline, IntroText } from "~/components";
import { I18nObject } from "~/i18n/getStepI18n";
import Hint from "~/components/Hint";
import { Trans } from "react-i18next";

export function StepHeadline({
  i18n,
  headlineText,
  descriptionText,
  asLegend,
  isWeitereErklaerung,
  testFeaturesEnabled,
}: {
  i18n: I18nObject;
  headlineText?: string;
  descriptionText?: string;
  asLegend?: boolean;
  isWeitereErklaerung?: boolean;
  testFeaturesEnabled?: boolean;
}) {
  if (!headlineText) {
    headlineText = isWeitereErklaerung
      ? i18n.headlineWeitereErklaerung
      : i18n.headline;
    if (!testFeaturesEnabled && i18n.headlineOld) {
      headlineText = i18n.headlineOld;
    }
  }

  descriptionText = descriptionText ? descriptionText : i18n.description;

  return (
    <>
      <Headline asLegend={asLegend}>{headlineText}</Headline>
      {descriptionText && <IntroText>{descriptionText}</IntroText>}
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
