import nunjucks from "nunjucks";

nunjucks.configure("app/mails/templates", {
  autoescape: false,
});

export const renderMailTemplate = ({
  template,
  props,
}: {
  template: string;
  props: Record<string, any>;
}) => {
  return nunjucks.render(`${template}.njk`, props);
};
