import { Form } from "@remix-run/react";
import { NavigationLink } from "~/components";
import LogoutIcon from "~/components/icons/mui/Logout";

export default function LogoutButton() {
  return (
    <Form method="post" action="/abmelden?index">
      <NavigationLink
        icon={<LogoutIcon className="w-24 h-24 fill-blue-800" />}
        isAllCaps
        data-testid="logout-button"
      >
        Abmelden
      </NavigationLink>
    </Form>
  );
}
