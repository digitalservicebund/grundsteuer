import { ContentContainer, Headline, IntroText } from "~/components/index";
import noJsImage from "~/assets/images/no-js.svg";

export default function EnableJsDisclaimer() {
  return (
    <div className="mt-16 sm:mt-32">
      <ContentContainer size="sm">
        <Headline>
          Um sich mit BundesIdent ausweisen zu können, müssen Sie JavaScript in
          Ihrem Browser aktivieren
        </Headline>
        <div className="w-full">
          <img
            src={noJsImage}
            alt="Schematisches Bild eines Smartphones"
            className="mb-32 ml-auto"
          />
        </div>
        <IntroText>
          Ändern Sie Ihre Einstellungen und laden Sie diese Seite neu um sich
          mit BundesIdent auszuweisen.
        </IntroText>
      </ContentContainer>
    </div>
  );
}
