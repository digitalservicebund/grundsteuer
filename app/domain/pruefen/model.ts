export type PruefenModel = {
  eigentuemerTyp?: {
    eigentuemerTyp: "privatperson" | "unternehmen" | "beratung";
  };
  erbengemeinschaft?: {
    isErbengemeinschaft:
      | "noErbengemeinschaft"
      | "erbengemeinschaftInGrundbuch"
      | "erbengemeinschaftNotInGrundbuch";
  };
};
