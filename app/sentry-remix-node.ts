import * as Sentry from "@sentry/node";
import { Transaction } from "@sentry/types";
import { isResponse } from "@remix-run/server-runtime/responses";
import { v4 as uuid } from "uuid";
import { Request, Response } from "express";
import { ServerBuild } from "@remix-run/node";

function wrapDataFunc(
  func: (...args: unknown[]) => unknown,
  routeId: string,
  method: string
) {
  const ogFunc = func;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return async (...args: any[]) => {
    const parentTransaction: Transaction | undefined =
      args[0].context && args[0].context.__sentry_transaction;
    const transaction =
      parentTransaction &&
      parentTransaction.startChild({
        op: `${method}:${routeId}`,
        description: `${method}: ${routeId}`,
      });
    transaction && transaction.setStatus("ok");
    transaction && (transaction.transaction = parentTransaction);

    try {
      return await ogFunc(...args);
    } catch (error) {
      if (isResponse(error)) {
        throw error;
      }

      Sentry.captureException(error, {
        tags: {
          global_id: parentTransaction && parentTransaction.tags["global_id"],
        },
      });
      transaction && transaction.setStatus("internal_error");
      throw error;
    } finally {
      transaction && transaction.finish();
    }
  };
}

export function registerSentry(build: ServerBuild) {
  const routes: Record<string, typeof build["routes"][string]> = {};

  for (const [id, route] of Object.entries(build.routes)) {
    const newRoute: typeof build["routes"][string] = {
      ...route,
      module: { ...route.module },
    };

    if (route.module.action) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore ts(2345)
      newRoute.module.action = wrapDataFunc(route.module.action, id, "action");
    }

    if (route.module.loader) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore ts(2345)
      newRoute.module.loader = wrapDataFunc(route.module.loader, id, "loader");
    }

    routes[id] = newRoute;
  }

  return {
    ...build,
    routes,
  };
}

export function sentryLoadContext(req: Request, res: Response) {
  const transaction = Sentry.getCurrentHub().startTransaction({
    op: "request",
    name: `${req.method}: ${req.url}`,
    description: `${req.method}: ${req.url}`,
    metadata: {
      requestPath: req.url,
    },
    tags: {
      global_id: uuid(),
    },
  });
  transaction && transaction.setStatus("internal_error");

  res.once("finish", () => {
    if (transaction) {
      transaction.setHttpStatus(res.statusCode);
      transaction.setTag("http.status_code", res.statusCode);
      transaction.setTag("http.method", req.method);
      transaction.finish();
    }
  });

  return {
    __sentry_transaction: transaction,
  };
}
