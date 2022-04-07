import invariant from "tiny-invariant";

const postToErica = async (endpoint: string, dataToSend: object) => {
  invariant(
    typeof process.env.ERICA_URL === "string",
    "environment variable ERICA_URL is not set"
  );

  const response = await fetch(`process.env.ERICA_URL/${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(dataToSend),
  });

  if (response.status == 201) {
    return response.headers.get("location");
  }
};

export { postToErica };
