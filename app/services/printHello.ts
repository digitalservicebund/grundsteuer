export type PrintHelloArgs = {
  name: string;
};

export const printHello = async ({ name }: PrintHelloArgs) => {
  await new Promise((resolve) => setTimeout(resolve, 100));
  if (name === "error") {
    throw new Error("[just a test] Error thrown by example background task");
  }
  console.log(`Hello, ${name}!`);
};
