import { createQueue, defaultOptions } from "~/queue.server";
import { type PrintHelloArgs, printHello as service } from "~/services";

const NAME = "print-hello";

const queue = createQueue<PrintHelloArgs>({
  name: NAME,
  processor: async ({ data }: { data: PrintHelloArgs }) => service(data),
});

export const printHello = async (data: PrintHelloArgs) => {
  return queue.add(NAME, data, defaultOptions());
};
