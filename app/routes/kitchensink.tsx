import { Outlet } from "remix";
import { Button, ContentContainer } from "~/components";

export default function KitchenSink() {
  return (
    <div className="py-32">
      <ContentContainer>
        <h1 className="text-32 font-bold">Kitchen Sink</h1>
        <Button
          to="/kitchensink"
          look="tertiary"
          size="small"
          className="mr-16"
        >
          Index
        </Button>
        <Button
          to="/kitchensink/buttons"
          look="tertiary"
          size="small"
          className="my-16"
        >
          Buttons
        </Button>
      </ContentContainer>
      <hr className="border-b border-b-gray-800 mb-32" />
      <Outlet />
    </div>
  );
}
