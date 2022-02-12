import { Form, useActionData, useLoaderData } from "remix";
import { Button } from "@digitalservice4germany/digital-service-library";
import AdresseStep from "~/domain/steps/adresse";

export { action, loader } from "./../../_step";

export default function Adresse() {
  const { cookie, formData } = useLoaderData();
  const actionData = useActionData();

  const step = new AdresseStep();
  return (
    <div className="p-8">
      {step ? (
        step.render(cookie, formData, actionData)
      ) : (
        <Form method="post">
          <Button>NEXT</Button>
        </Form>
      )}
    </div>
  );
}
