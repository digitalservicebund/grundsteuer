import { LoaderFunction, useLoaderData } from "remix";
import { getFormDataCookie } from "~/cookies";
import { createGraph } from "~/domain";
import { Handle } from "~/root";
import { defaults } from "~/domain/model";

export const loader: LoaderFunction = async ({ request }) => {
  const cookie = await getFormDataCookie(request);

  const graph = createGraph({
    machineContext: Object.keys(cookie).length < 1 ? defaults : cookie.records,
  });

  return { graph };
};

// this will activate showing the form navigation in root.tsx
export const handle: Handle = {
  showFormNavigation: true,
};

export default function Zusammenfassung() {
  const { graph } = useLoaderData();

  return (
    <div className="bg-beige-100 h-full p-4">
      <h1 className="mb-8 font-bold text-4xl">Zusammenfassung</h1>
      <pre>{JSON.stringify({ graph }, null, 2)}</pre>
    </div>
  );
}
