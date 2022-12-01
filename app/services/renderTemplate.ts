import nunjucks from "nunjucks";

nunjucks.configure("app/mails/templates", {
  autoescape: false,
});

export const renderTemplate = ({
  template,
  props,
}: {
  template: string;
  props: Record<string, any>;
}) => {
  return nunjucks.render(`${template}.njk`, props);
};
