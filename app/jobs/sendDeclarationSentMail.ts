import { createQueue, defaultOptions } from "~/queue.server";
import type { SendDeclarationSentMailArgs } from "~/services";
import { sendDeclarationSentMail as service } from "~/services";

const NAME = "send-declaration-sent-mail";

const queue = createQueue<SendDeclarationSentMailArgs>({
  name: NAME,
  processor: async ({ data }: { data: SendDeclarationSentMailArgs }) =>
    service(data),
});

export const sendDeclarationSentMail = async (
  data: SendDeclarationSentMailArgs
) => {
  return queue.add(NAME, data, defaultOptions());
};
