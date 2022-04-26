import { Details } from "~/components";
import QuestionMark from "~/components/icons/mui/QuestionMark";
import { I18nObject } from "~/i18n/getStepI18n";

export function StepHeadline({ i18n }: { i18n: I18nObject }) {
  return (
    <>
      {i18n.headlineHelp && (
        <Details
          summaryContent={
            <h1 className="mb-8 font-bold text-4xl">
              {i18n.headline}
              <QuestionMark
                className="inline-block float-right"
                role="img"
                aria-label="Hinweis"
              />
            </h1>
          }
          detailsContent={<p>{i18n.headlineHelp}</p>}
        />
      )}
      {!i18n.headlineHelp && (
        <h1 className="mb-8 font-bold text-4xl">{i18n.headline}</h1>
      )}
    </>
  );
}
