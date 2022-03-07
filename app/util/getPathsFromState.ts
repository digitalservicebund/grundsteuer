// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getPathsFromState = ({ state }: { state: any }) => {
  const path: string = state.toStrings().at(-1) || "";
  let pathWithId = path;
  if (state.matches("eigentuemer.person")) {
    const personId = state.context?.personId || 1;
    pathWithId = pathWithId.replace(/\.person\./, `.person.${personId}.`);
  } else if (state.matches("grundstueck.flurstueck")) {
    const flurstueckId = state.context?.flurstueckId || 1;
    pathWithId = pathWithId.replace(
      /\.flurstueck\./,
      `.flurstueck.${flurstueckId}.`
    );
  }

  return { path, pathWithId };
};
