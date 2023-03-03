import { db } from "~/db.server";

export const createSurvey = async (category: string, content: string) => {
  return db.survey.create({
    data: {
      category,
      content,
    },
  });
};
