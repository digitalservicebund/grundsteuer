import {
  type Processor,
  Queue as BullQueue,
  Worker,
  type Job as BullJob,
} from "bullmq";
import { v4 as uuidv4 } from "uuid";
import { Feature, getClient, redis } from "~/redis/redis.server";
import * as Sentry from "@sentry/remix";

type RegisteredQueue = {
  queue: BullQueue;
  worker: Worker;
};

declare global {
  // eslint-disable-next-line
  var __registeredQueues: Record<string, RegisteredQueue> | undefined;
}

const connection = getClient();

const withSentry = (processor: Processor) => {
  return async (job: BullJob<any, any, string>) => {
    try {
      const result = await processor(job);
      return result;
    } catch (e) {
      Sentry.captureException(e);
      throw e;
    }
  };
};

const registeredQueues =
  global.__registeredQueues || (global.__registeredQueues = {});

export function createQueue<Payload>({
  name,
  processor,
}: {
  name: string;
  processor: Processor<Payload>;
}): BullQueue<Payload> {
  if (registeredQueues[name]) {
    return registeredQueues[name].queue;
  }

  const queue = new BullQueue<Payload>(name, { connection });
  const worker = new Worker<Payload>(name, withSentry(processor), {
    connection,
  });

  registeredQueues[name] = { queue, worker };

  return queue;
}

export const getJob = async ({ name, id }: { name: string; id: string }) =>
  redis.hgetall(Feature.JOB_QUEUE, `${name}:${id}`);

export const defaultOptions = () => {
  return {
    jobId: uuidv4(),
    removeOnComplete: {
      age: 3600 * 24 * 7, // keep finished job for 7 days
    },
  };
};
