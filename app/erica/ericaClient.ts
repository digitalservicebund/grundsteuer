import invariant from "tiny-invariant";

const postToErica = async (endpoint: string) => {
  invariant(
    typeof process.env.ERICA_URL === "string",
    "environment variable ERICA_URL is not set"
  );

  const response = await fetch(`process.env.ERICA_URL/${endpoint}`);

  if (response.status == 201) {
    return response.headers.get("location");
  }
};

export { postToErica };
