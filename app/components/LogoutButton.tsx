import { Form } from "@remix-run/react";
import { Button } from "~/components";
import LogoutIcon from "~/components/icons/mui/Logout";

export default function LogoutButton() {
  return (
    <Form method="post" action="/abmelden?index">
      <Button
        size="small"
        look="ghost"
        icon={<LogoutIcon />}
        data-testid="logout-button"
      >
        Abmelden
      </Button>
    </Form>
  );
}
