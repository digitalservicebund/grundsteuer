import { MetaFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { Button, ContentContainer } from "~/components";
import { pageTitle } from "~/util/pageTitle";

export const meta: MetaFunction = () => {
  return { title: pageTitle("Kitchen Sink"), robots: "noindex" };
};

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
          className="mr-16"
        >
          Buttons
        </Button>
        <Button
          to="/kitchensink/form"
          look="tertiary"
          size="small"
          className="mr-16 my-16"
        >
          Form
        </Button>
        <Button
          to="/kitchensink/spinner"
          look="tertiary"
          size="small"
          className="mr-16 my-16"
        >
          Spinner
        </Button>
        <Button
          to="/kitchensink/help"
          look="tertiary"
          size="small"
          className="mr-16 my-16"
        >
          Help
        </Button>
        <Button
          to="/kitchensink/icons"
          look="tertiary"
          size="small"
          className="mr-16 my-16"
        >
          Icons
        </Button>
        <Button
          to="/kitchensink/emailStatus"
          look="tertiary"
          size="small"
          className="mr-16 my-16"
        >
          EmailStatus
        </Button>
      </ContentContainer>
      <hr className="border-b border-b-gray-800 mb-32" />
      <Outlet />
    </div>
  );
}
