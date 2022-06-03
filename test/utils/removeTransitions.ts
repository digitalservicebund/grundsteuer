export type RecursiveStringRecord = {
  [index: string]: RecursiveStringRecord | string;
};

export const removeTransitions = (
  refStates: RecursiveStringRecord,
  transitionName: "NEXT" | "BACK"
): RecursiveStringRecord => {
  return Object.entries({ ...refStates }).reduce((acc, [k, v]) => {
    if (k === transitionName) {
      return { ...acc, [k]: undefined };
    } else if (Array.isArray(v)) {
      return {
        ...acc,
        [k]: v.map((c) =>
          typeof c === "object" ? removeTransitions(c, transitionName) : c
        ),
      };
    } else if (v !== null && typeof v === "object") {
      return {
        ...acc,
        [k]: removeTransitions(v, transitionName),
      };
    } else {
      return { ...acc, [k]: v };
    }
  }, {});
};
