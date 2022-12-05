import { hash } from "./hash";
import { redis, Feature } from "~/redis/redis.server";

export const storeMessageId = async ({
  to,
  messageId,
}: {
  to: string;
  messageId: string;
}) => {
  return redis.set(
    Feature.MESSAGE_ID,
    hash(to),
    JSON.stringify({
      email: to,
      messageId: hash(messageId),
    }),
    3600
  );
};
