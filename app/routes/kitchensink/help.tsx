import {
  Checkbox,
  ContentContainer,
  FormGroup,
  Input,
  RadioGroup,
  Select,
} from "~/components";
import unbebautImage from "~/assets/images/icon_unbebaut.svg";
import baureifImage from "~/assets/images/icon_baureif.svg";
import RadioWithImageGroup from "~/components/form/RadioWithImageGroup";
import Help from "~/components/Help";
import AngabenGrundbuch from "~/assets/images/angaben-grundbuch-page-medium.png";
import DefaultHelp from "~/components/form/help/Default";
import Hint from "~/components/Hint";

export default function KitchenSinkHelp() {
  return (
    <ContentContainer>
      <Hint>
        Bitte tragen Sie das Aktenzeichen / die Steuernummer ohne Sonderzeichen
        ein.
      </Hint>
      <Help>
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
          help={
            <DefaultHelp
              elements={[
                { type: "paragraph", value: "Text" },
                {
                  type: "list",
                  intro: "Intro:",
                  items: ["Item 1", "Item 2"],
                },
                {
                  type: "image",
                  source: AngabenGrundbuch,
                  altText: "Angaben Grundbuch",
                },
              ]}
            />
          }
        />
      </FormGroup>
      <FormGroup>
        <Input
          name="emailError"
          type="email"
          label="Input with error message"
          help={<p>Hilfetext…</p>}
          error="Fehler!"
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
          help={<p>Hilfetext…</p>}
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
          help={<p>Hilfetext…</p>}
        />
      </FormGroup>

      <FormGroup>
        <Checkbox name="checkbox" help={<p>Hilfetext…</p>}>
          Lorem ipsum
        </Checkbox>
      </FormGroup>
      <FormGroup>
        <Checkbox
          name="checkbox4"
          error="Error message"
          help={<p>Hilfetext…</p>}
        >
          with error
        </Checkbox>
      </FormGroup>

      <FormGroup>
        <RadioGroup
          name={"radio"}
          options={[
            {
              value: "option1",
              label: "Option 1",
              help: <p>Hilfetext 1...</p>,
            },
            {
              value: "option2",
              label: "Option 2",
              help: <p>Hilfetext 2...</p>,
            },
          ]}
        />
      </FormGroup>
      <FormGroup>
        <RadioWithImageGroup
          name={"radio"}
          options={[
            {
              value: "First Radio button with image",
              label: "First radio button label",
              image: unbebautImage,
              imageAltText: "Bild mit Haus",
              help: <p>Hilfetext...</p>,
            },
            {
              value: "Second Radio button with image",
              label:
                "Second radio button label with a lot more text: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
              image: baureifImage,
              imageAltText: "Bild mit Haus",
              help: <p>Hilfetext...</p>,
            },
          ]}
        />
      </FormGroup>
    </ContentContainer>
  );
}
