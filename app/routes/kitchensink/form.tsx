import {
  Button,
  ButtonContainer,
  ContentContainer,
  FormGroup,
  Input,
  MaskedInput,
  Select,
} from "~/components";

export default function KitchenSinkForm() {
  return (
    <ContentContainer>
      <FormGroup>
        <Input
          name="email"
          type="email"
          label="Input type email"
          placeholder="user@example.com"
          help="Hilfetext…"
        />
      </FormGroup>
      <FormGroup>
        <Input
          name="emailDisabled"
          type="email"
          label="Disabled Input"
          disabled
        />
      </FormGroup>
      <FormGroup>
        <Input
          name="emailError"
          type="email"
          label="Input with error message"
          help="Hilfetext…"
          error="Fehler!"
        />
      </FormGroup>
      <FormGroup>
        <MaskedInput
          mask={"00 000 000 000"}
          name="maskedInput"
          label="MaskedInput"
          help="Hilfetext…"
        />
      </FormGroup>
      <FormGroup>
        <Select
          name="select"
          label="Select"
          options={[
            { value: "1", label: "eins" },
            { value: "2", label: "zwei" },
          ]}
          help="Hilfetext…"
        />
      </FormGroup>
      <FormGroup>
        <Select
          name="selectError"
          label="Select with error"
          defaultValue="1"
          options={[
            { value: "1", label: "eins" },
            { value: "2", label: "zwei" },
          ]}
          error="Fehler !"
        />
      </FormGroup>

      <ContentContainer size="sm" className="border border-black">
        <ButtonContainer className="mb-32 border border-red-500">
          <Button>Übernehmen & Weiter</Button>
          <Button look="secondary">Zurück</Button>
        </ButtonContainer>
        <ButtonContainer className="mb-32 border border-green-500">
          <Button className="flex-grow">Übernehmen & Weiter</Button>
          <Button className="flex-grow" look="secondary">
            Zurück
          </Button>
        </ButtonContainer>
        <ButtonContainer forceMultiline className="border border-red-500">
          <Button>Übernehmen & Weiter</Button>
          <Button look="secondary">Zurück</Button>
        </ButtonContainer>
      </ContentContainer>
    </ContentContainer>
  );
}
