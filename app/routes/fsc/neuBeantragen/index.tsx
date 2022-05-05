import { LoaderFunction } from "@remix-run/node";
import { Button, ContentContainer } from "~/components";

export const loader: LoaderFunction = async () => {
  return {};
};

export default function FscNeuBeantragen() {
  return (
    <ContentContainer size="sm">
      <pre className="mb-32">TODO (STL-2043)</pre>
      <Button look="secondary" to="/formular/welcome">
        Neu beantragen
      </Button>
    </ContentContainer>
  );
}
