import { ContentContainer, FormGroup, Input } from "~/components";
import MaskedInput from "~/components/MaskedInput";

export default function KitchenSinkForm() {
  return (
    <ContentContainer>
      <FormGroup>
        <Input
          name="email"
          type="email"
          label="E-Mail-Adresse"
          placeholder="user@example.com"
          help="Hilfetext…"
        />
      </FormGroup>
      <FormGroup>
        <Input name="email1" type="email" label="E-Mail-Adresse" disabled />
      </FormGroup>
      <FormGroup>
        <Input
          name="email2"
          type="email"
          label="E-Mail-Adresse"
          help="Hilfetext…"
          error="Fehler!"
        />
      </FormGroup>
      <FormGroup>
        <MaskedInput
          mask={"00 000 000 000"}
          name="steuernr"
          label="Steuer Nr."
          help="Hilfetext…"
          error="Fehler!"
        />
      </FormGroup>
    </ContentContainer>
  );
}
