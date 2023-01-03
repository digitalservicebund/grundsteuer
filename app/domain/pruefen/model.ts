export type AbgeberFields = {
  abgeber:
    | "eigentuemer"
    | "angehoerig"
    | "keinEigentuemer"
    | "eigentuemerNeu"
    | "steuerberater";
};
export type EigentuemerTypFields = {
  eigentuemerTyp:
    | "privatperson"
    | "erbengemeinschaft"
    | "mehrereErben"
    | "unternehmen";
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

export type BewohnbarFields = {
  bewohnbar: "bewohnbar" | "nichtBewohnbar" | "unbebaut";
};

export type GrundstueckArtFields = {
  grundstueckArt:
    | "einfamilienhaus"
    | "zweifamilienhaus"
    | "eigentumswohnung"
    | "mehrfamilienhaus"
    | "nichtWohn"
    | "unbebaut"
    | "landUndForst";
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

export type PruefenModel = {
  start?: AbgeberFields;
  eigentuemerTyp?: EigentuemerTypFields;
  bundesland?: BundeslandFields;
  bewohnbar?: BewohnbarFields;
  grundstueckArt?: GrundstueckArtFields;
  ausland?: AuslandFields;
  fremderBoden?: FremderBodenFields;
  beguenstigung?: BeguenstigungFields;
};
