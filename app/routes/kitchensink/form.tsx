import {
  Button,
  ButtonContainer,
  Checkbox,
  ContentContainer,
  FormGroup,
  Input,
  MaskedInput,
  Radio,
  Select,
} from "~/components";
import RadioButtonBild from "~/components/form/RadioButtonBild";
import unbebautImage from "~/assets/images/icon_unbebaut.svg";
import baureifImage from "~/assets/images/icon_baureif.svg";
import RadioWithImageGroup from "~/components/form/RadioWithImageGroup";
import Help from "~/components/Help";
import Hint from "~/components/Hint";
import AngabenGrundbuch from "~/assets/images/angaben-grundbuch-page-medium.png";

export default function KitchenSinkForm() {
  return (
    <ContentContainer>
      <Help isShown={true}>
        <Hint>
          Unterstrichene Zeilen im Grundbuchauszug bedeuten, dass diese Einträge
          nicht mehr gültig sind. Diese werden nicht mitgezählt.
        </Hint>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec
          odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla
          quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent
          mauris. Fusce nec tellus sed augue semper porta. Mauris massa.
          Vestibulum lacinia arcu eget nulla.
        </p>
        <p>
          Class aptent taciti sociosqu ad litora torquent per conubia nostra,
          per inceptos himenaeos. Curabitur sodales ligula in libero. Sed
          dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean
          quam. In scelerisque sem at dolor. Maecenas mattis. Sed convallis
          tristique sem. Proin ut ligula vel nunc egestas porttitor. Morbi
          lectus risus, iaculis vel, suscipit quis, luctus non, massa. Fusce ac
          turpis quis ligula lacinia aliquet. Mauris ipsum.{" "}
        </p>
        <img src={AngabenGrundbuch} alt={"Some picture"} />
        <p>
          Class aptent taciti sociosqu ad litora torquent per conubia nostra,
          per inceptos himenaeos. Curabitur sodales ligula in libero. Sed
          dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean
          quam. In scelerisque sem at dolor. Maecenas mattis. Sed convallis
          tristique sem. Proin ut ligula vel nunc egestas porttitor. Morbi
          lectus risus, iaculis vel, suscipit quis, luctus non, massa. Fusce ac
          turpis quis ligula lacinia aliquet. Mauris ipsum.{" "}
        </p>
      </Help>
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

      <FormGroup>
        <Checkbox name="checkbox">Lorem ipsum</Checkbox>
      </FormGroup>
      <FormGroup>
        <Checkbox name="checkbox2">
          Lorem Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat nia deserunt mollit anim
          id est laborum
        </Checkbox>
      </FormGroup>
      <FormGroup>
        <Checkbox name="checkbox3" disabled>
          disabled
        </Checkbox>
      </FormGroup>
      <FormGroup>
        <Checkbox name="checkbox4" error="Error message">
          with error
        </Checkbox>
      </FormGroup>

      <FormGroup>
        <Radio name="radio" value="radio_1">
          Lorem ipsum 1
        </Radio>
      </FormGroup>
      <FormGroup>
        <Radio
          name="radio"
          value="radio_2"
          error="Sie müssen dieses Feld auswählen"
        >
          Lorem ipsum 2
        </Radio>
      </FormGroup>
      <FormGroup>
        <RadioButtonBild
          name="radio-button-bild"
          value="radio_bild_1"
          image={unbebautImage}
          imageAltText="Bild mit Haus"
        >
          Radio button with image
        </RadioButtonBild>
      </FormGroup>

      <FormGroup>
        <RadioWithImageGroup
          name="radio-selection"
          options={[
            {
              value: "First Radio button with image",
              label: "First radio button label",
              image: unbebautImage,
              imageAltText: "Bild mit Haus",
            },
            {
              value: "Second Radio button with image",
              label:
                "Second radio button label with a lot more text: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
              image: baureifImage,
              imageAltText: "Bild mit Haus",
            },
          ]}
        />
      </FormGroup>

      <ContentContainer size="sm" className="border border-black">
        <ButtonContainer className="mb-32 border border-green-500">
          <Button>Übernehmen & Weiter</Button>
          <Button look="secondary">Zurück</Button>
        </ButtonContainer>
      </ContentContainer>
    </ContentContainer>
  );
}
