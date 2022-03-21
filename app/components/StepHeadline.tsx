import React from "react";
import Details from "~/components/Details";
import QuestionMark from "~/components/icons/mui/QuestionMark";
import { I18nObject } from "~/routes/formular/_step";

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
