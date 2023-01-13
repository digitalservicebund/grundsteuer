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
  bewohnbar: "bewohnbar" | "unbewohnbar" | "unbebaut";
};

export type BewohnbarType =
  | "einfamilienhaus"
  | "zweifamilienhaus"
  | "eigentumswohnung"
  | "hof"
  | "mehrfamilienhaus";

export type GebaeudeArtBewohnbarFields = {
  gebaeude: BewohnbarType;
};

export type UnbewohnbarType =
  | "garage"
  | "imBau"
  | "verfallen"
  | "wochenendhaus"
  | "geschaeft"
  | "luf"
  | "other";

export type GebaeudeArtUnbewohnbarFields = {
  gebaeude: UnbewohnbarType;
};

export type UnbebautType =
  | "baureif"
  | "acker"
  | "wald"
  | "garten"
  | "moor"
  | "other";

export type GebaeudeArtUnbebautFields = {
  art: UnbebautType;
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

export type NutzungsartFields = {
  privat: "true" | "false";
};

export type PruefenModel = {
  start?: AbgeberFields;
  abgeber?: AbgeberFields;
  eigentuemerTyp?: EigentuemerTypFields;
  bundesland?: BundeslandFields;
  bewohnbar?: BewohnbarFields;
  gebaeudeArtBewohnbar?: GebaeudeArtBewohnbarFields;
  gebaeudeArtUnbewohnbar?: GebaeudeArtUnbewohnbarFields;
  gebaeudeArtUnbebaut?: GebaeudeArtUnbebautFields;
  grundstueckArt?: GrundstueckArtFields;
  ausland?: AuslandFields;
  fremderBoden?: FremderBodenFields;
  beguenstigung?: BeguenstigungFields;
  nutzungsartBebaut?: NutzungsartFields;
  nutzungsartUnbebaut?: NutzungsartFields;
};
