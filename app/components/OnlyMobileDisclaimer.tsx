import usePhoneImage from "~/assets/images/use-phone.svg";
import { ContentContainer, Headline, IntroText } from "~/components/index";

export default function OnlyMobileDisclaimer() {
  return (
    <div className="mt-16 sm:mt-32">
      <ContentContainer size="sm">
        <Headline>
          Auf diese Seite können Sie nur über ein mobiles Gerät zugreifen
        </Headline>
        <IntroText>
          Die Identifikation mit dem Personalausweis über die BundesIdent App
          ist nur auf mobilen Geräten möglich. Für eine andere Identifikation
          kehren Sie zurück zur Auswahl.
        </IntroText>
      </ContentContainer>
      <img src={usePhoneImage} alt="" className="max-w-[300px]" />
    </div>
  );
}
