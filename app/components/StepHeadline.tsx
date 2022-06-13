import { Headline, IntroText } from "~/components";
import { I18nObject } from "~/i18n/getStepI18n";
import Hint from "~/components/Hint";
import { Trans } from "react-i18next";

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
