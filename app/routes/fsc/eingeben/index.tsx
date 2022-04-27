import { LoaderFunction } from "@remix-run/node";
import { SimplePageLayout } from "~/components";

export const loader: LoaderFunction = async () => {
  return {};
};

export default function FscEingeben() {
  return (
    <SimplePageLayout>
      <pre>TODO (STL-2042)</pre>
    </SimplePageLayout>
  );
}
