import { BmfLogo, ContentContainer } from "~/components";
import { Outlet } from "@remix-run/react";

export default function StaticPagesLayout() {
  return (
    <ContentContainer>
      <div className="pt-32 mb-32 md:mb-64">
        <BmfLogo />
      </div>

      <ContentContainer size="md">
        <Outlet />
      </ContentContainer>
    </ContentContainer>
  );
}
