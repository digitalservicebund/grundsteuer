import {
  Button,
  LabeledInput,
} from "@digitalservice4germany/digital-service-library";

export default function Index() {
  return (
    <div className="bg-beige-100 h-full p-4">
      <h1>Step 1</h1>

      <form>
        <LabeledInput type="text" name="street" label="Straße" />

        <Button label="Weiter" />
      </form>
    </div>
  );
}
