import { ContentContainer, FormGroup, Input } from "~/components";

export default function KitchenSinkForm() {
  return (
    <ContentContainer>
      <FormGroup>
        <Input
          type="email"
          labelText="E-Mail-Adresse"
          placeholder="user@example.com"
        />
      </FormGroup>
      <FormGroup>
        <Input type="email" labelText="E-Mail-Adresse" disabled />
      </FormGroup>
      <FormGroup>
        <Input type="email" labelText="E-Mail-Adresse" errorMessage="Fehler!" />
      </FormGroup>
    </ContentContainer>
  );
}
