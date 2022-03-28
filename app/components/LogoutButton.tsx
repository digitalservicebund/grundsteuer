import { Form } from "remix";
import { Button } from "~/components";

export default function LogoutButton() {
  return (
    <Form method="post" action="/abmelden?index">
      <Button size="small" look="tertiary">
        Abmelden
      </Button>
    </Form>
  );
}
