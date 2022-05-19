import { Headline, IntroText } from "~/components";
import { I18nObject } from "~/i18n/getStepI18n";

export function StepHeadline({
  i18n,
  asLegend,
}: {
  i18n: I18nObject;
  asLegend?: boolean;
}) {
  return (
    <>
      <Headline asLegend={asLegend}>{i18n.headline}</Headline>
      {i18n.description && <IntroText>{i18n.description}</IntroText>}
    </>
  );
}
