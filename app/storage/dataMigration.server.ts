export const migrateData = (decodedData: any) => {
  // migrate old grundstuecktyp data to new grundstuecktyp or haustyp
  migrateGrundstueckTyp(decodedData);

  // migrate old miteigentumsanteil data to new miteigentumWohnung
  migrateMiteigentum(decodedData);
  return decodedData;
};

const migrateGrundstueckTyp = (decodedData: any) => {
  if (
    decodedData?.grundstueck &&
    decodedData?.grundstueck?.typ &&
    !decodedData?.grundstueck?.bebaut
  ) {
    if (
      ["einfamilienhaus", "zweifamilienhaus", "wohnungseigentum"].includes(
        decodedData.grundstueck.typ.typ
      )
    ) {
      decodedData.grundstueck.haustyp = {
        haustyp: decodedData.grundstueck.typ.typ,
      };
      decodedData.grundstueck.bebaut = {
        bebaut: "bebaut",
      };
      delete decodedData.grundstueck.typ;
    } else if (decodedData.grundstueck.typ.typ === "baureif") {
      decodedData.grundstueck.grundstuecktyp = {
        grundstuecktyp: decodedData.grundstueck.typ.typ,
      };
      decodedData.grundstueck.bebaut = {
        bebaut: "unbebaut",
      };
      delete decodedData.grundstueck.typ;
    } else if (decodedData.grundstueck.typ.typ === "abweichendeEntwicklung") {
      decodedData.grundstueck.bebaut = {
        bebaut: "unbebaut",
      };
      delete decodedData.grundstueck.typ;
      if (
        decodedData.grundstueck.abweichendeEntwicklung?.abweichendeEntwicklung
      ) {
        decodedData.grundstueck.grundstuecktyp = {
          grundstuecktyp:
            decodedData.grundstueck.abweichendeEntwicklung
              ?.abweichendeEntwicklung,
        };
        delete decodedData.grundstueck.abweichendeEntwicklung
          .abweichendeEntwicklung;
      }
    }
  }
};

const migrateMiteigentum = (decodedData: any) => {
  if (
    decodedData?.grundstueck &&
    decodedData?.grundstueck?.miteigentumsanteil &&
    !decodedData?.grundstueck?.miteigentumAuswahlWohnung &&
    !decodedData?.grundstueck?.miteigentumWohnung
  ) {
    decodedData.grundstueck.miteigentumAuswahlWohnung = {
      miteigentumTyp: "none",
    };
    decodedData.grundstueck.miteigentumWohnung =
      decodedData.grundstueck?.miteigentumsanteil;
  }

  // migrate grundbuchblattnummer for wohnung option 1 & 2
  if (
    decodedData?.grundstueck &&
    decodedData?.grundstueck.typ &&
    decodedData?.grundstueck.typ.typ === "wohnungseigentum" &&
    decodedData?.grundstueck.miteigentumAuswahlWohnung
  ) {
    const miteigentumOption =
      decodedData.grundstueck.miteigentumAuswahlWohnung.miteigentumTyp;
    if (
      (miteigentumOption === "none" || miteigentumOption == "garage") &&
      decodedData.grundstueck.flurstueck &&
      decodedData.grundstueck.flurstueck[0]?.angaben?.grundbuchblattnummer
    ) {
      if (!decodedData.grundstueck.miteigentumWohnung) {
        decodedData.grundstueck.miteigentumWohnung = {};
      }
      decodedData.grundstueck.miteigentumWohnung.grundbuchblattnummer =
        decodedData.grundstueck.flurstueck[0]?.angaben?.grundbuchblattnummer;
    }
  }
};
