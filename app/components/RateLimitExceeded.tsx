import {
  Button,
  ContentContainer,
  Headline,
  IntroText,
} from "~/components/index";
import Loop from "~/components/icons/mui/Loop";
import illustration from "~/assets/images/ekona-busy.svg";

export default function RateLimitExceeded(props: {
  service: string;
}): JSX.Element {
  return (
    <ContentContainer size="sm" className="mb-80">
      <Headline>
        Zu viele Zugriffe.
        <p>Seite bitte neu laden.</p>
      </Headline>
      <IntroText>
        Aktuell scheint es zu viele Zugriffe über die {props.service}{" "}
        Schnittstelle zu geben. Keine Sorge — Ihre Daten sind sicher. Bitte
        laden Sie die Seite einfach noch einmal.
      </IntroText>
      <div className="mt-64">
        <Button look="primary" size="medium" icon={<Loop />} to=".">
          Seite neu laden
        </Button>
      </div>
      <img src={illustration} alt="" role="presentation" className="mt-48" />
    </ContentContainer>
  );
}
