export const sharedAdresse = {
  fields: {
    strasse: {
      validations: {
        requiredIf: {
          dependentField: "hausnummer",
          msg: "musst du eingeben",
        },
        maxLength: {
          param: 12,
          msg: "zu lang",
        },
      },
    },
    hausnummer: {
      validations: {
        requiredIf: {
          dependentField: "strasse",
          msg: "musst du eingeben",
        },
        maxLength: {
          param: 12,
          msg: "zu lang",
        },
      },
    },
    zusatzangaben: { validations: {} },
    postfach: { validations: {} },
    plz: { validations: {} },
    ort: { validations: {} },
  },
};
