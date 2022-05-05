import { Details, Headline } from "~/components";
import QuestionMark from "~/components/icons/mui/QuestionMark";
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
      {i18n.headlineHelp && (
        <Details
          summaryContent={
            <Headline asLegend={asLegend}>
              {i18n.headline}
              <QuestionMark
                className="inline-block float-right"
                role="img"
                aria-label="Hinweis"
              />
            </Headline>
          }
          detailsContent={<p>{i18n.headlineHelp}</p>}
        />
      )}
      {!i18n.headlineHelp && (
        <Headline asLegend={asLegend}>{i18n.headline}</Headline>
      )}
    </>
  );
}
