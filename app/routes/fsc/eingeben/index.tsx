import { LoaderFunction } from "@remix-run/node";
import { Button, ContentContainer } from "~/components";

export const loader: LoaderFunction = async () => {
  return {};
};

export default function FscEingeben() {
  return (
    <ContentContainer size="sm">
      <pre className="mb-32">TODO (STL-2042)</pre>
      <Button look="secondary" to="/formular/welcome">
        Später eingeben
      </Button>
    </ContentContainer>
  );
}
