import { createQueue, defaultOptions } from "~/queue.server";
import {
  type SendFscRequestCreatedMailArgs,
  sendFscRequestCreatedMail as service,
} from "~/services";

const NAME = "send-fsc-request-created-mail";

const queue = createQueue<SendFscRequestCreatedMailArgs>({
  name: NAME,
  processor: async ({ data }: { data: SendFscRequestCreatedMailArgs }) =>
    service(data),
});

export const sendFscRequestCreatedMail = async (
  data: SendFscRequestCreatedMailArgs
) => {
  return queue.add(NAME, data, defaultOptions());
};
