import nunjucks from "nunjucks";
import { format } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";

const env = nunjucks.configure("app/mails/templates", {
  autoescape: false,
});

env.addFilter(
  "url",
  (relativePath: string) => `${process.env.BASE_URL}${relativePath}`
);

env.addFilter("date", (utcDate: Date) =>
  format(utcToZonedTime(utcDate, "Europe/Berlin"), "dd.MM.yyyy")
);

env.addFilter("apostrophize", (text: string) => `„${text}“`);

export const renderMailTemplate = ({
  template,
  props,
}: {
  template: string;
  props: Record<string, any>;
}) => {
  return nunjucks.render(`${template}.njk`, props);
};
