import { ericaUtils } from "~/erica/utils";
import { FetcherWithComponents } from "@remix-run/react";

export type IntervalInstance = {
  timer: NodeJS.Timer | null;
  stoppedFetching: boolean;
};

export const fetchInDynamicInterval = (
  showSpinner: boolean,
  fetchInProgress: boolean,
  setFetchInProgress: (newValue: boolean) => void,
  fetcher: FetcherWithComponents<any>,
  interval: IntervalInstance,
  startTime: number,
  fetchUrl: string
) => {
  if (interval.timer) {
    clearInterval(interval.timer);
    interval.timer = null;
  }

  if (!interval.stoppedFetching && showSpinner && !fetchInProgress) {
    interval.timer = setInterval(() => {
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
  }
  return interval.timer;
};
