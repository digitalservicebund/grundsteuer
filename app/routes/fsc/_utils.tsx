import { ericaUtils } from "~/erica/utils";
import { FetcherWithComponents } from "@remix-run/react";

export const fetchInDynamicInterval = (
  showSpinner: boolean,
  fetchInProgress: boolean,
  setFetchInProgress: (newValue: boolean) => void,
  fetcher: FetcherWithComponents<any>,
  interval: NodeJS.Timer | null,
  startTime: number,
  fetchUrl: string
) => {
  if (interval) {
    clearInterval(interval);
    interval = null;
  }

  interval = setInterval(() => {
    if (showSpinner && !fetchInProgress) {
      setFetchInProgress(true);
      fetcher.load(fetchUrl);
      setFetchInProgress(false);
      fetchInDynamicInterval(
        showSpinner,
        fetchInProgress,
        setFetchInProgress,
        fetcher,
        interval,
        startTime,
        fetchUrl
      );
    }
  }, ericaUtils.calculateFetchSleep(startTime));
  return interval;
};
