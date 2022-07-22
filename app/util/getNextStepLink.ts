export const getNextStepLink = (url: string) => {
  const urlObject = new URL(url);
  const redirectToSummary = urlObject.searchParams.get("redirectToSummary");
  return redirectToSummary ? "/formular/zusammenfassung" : "/formular/welcome";
};
