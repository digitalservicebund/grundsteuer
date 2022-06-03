export type EigentuemerTypFields = {
  eigentuemerTyp: "privatperson" | "unternehmen" | "beratung";
};

export type ErbengemeinschaftFields = {
  isErbengemeinschaft:
    | "noErbengemeinschaft"
    | "erbengemeinschaftInGrundbuch"
    | "erbengemeinschaftNotInGrundbuch";
};

export type BundeslandFields = {
  bundesland:
    | "BW"
    | "BY"
    | "BE"
    | "BB"
    | "HB"
    | "HH"
    | "HE"
    | "MV"
    | "NI"
    | "NW"
    | "RP"
    | "SL"
    | "SN"
    | "ST"
    | "SH"
    | "TH";
};

export type GrundstueckArtFields = {
  grundstueckArt:
    | "einfamilienhaus"
    | "zweifamilienhaus"
    | "eigentumswohnung"
    | "mehrfamilienhaus"
    | "mehrereGebaeude"
    | "nichtWohn"
    | "unbebaut"
    | "landUndForst";
};

export type GaragenFields = {
  garagen:
    | "garageAufGrundstueck"
    | "garageAufAnderemGrundstueck"
    | "tiefgarage"
    | "keine";
};

export type AuslandFields = {
  ausland: "true" | "false";
};

export type FremderBodenFields = {
  fremderBoden: "true" | "false";
};

export type BeguenstigungFields = {
  beguenstigung: "true" | "false";
};

export type ElsterFields = {
  elster: "true" | "false";
};

export type PruefenModel = {
  eigentuemerTyp?: EigentuemerTypFields;
  erbengemeinschaft?: ErbengemeinschaftFields;
  bundesland?: BundeslandFields;
  grundstueckArt?: GrundstueckArtFields;
  garagen?: GaragenFields;
  ausland?: AuslandFields;
  fremderBoden?: FremderBodenFields;
  beguenstigung?: BeguenstigungFields;
  elster?: ElsterFields;
};
