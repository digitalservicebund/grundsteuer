import { StepComponentFunction } from "~/routes/formular/_step";
import IntroText from "../IntroText";
import SubHeadline from "../SubHeadline";
import UebersichtStep from "~/components/form/UebersichtStep";
import welcomeImage from "~/assets/images/uebersicht-willkommen.svg";
import welcomeImageSmall from "~/assets/images/uebersicht-willkommen-small.svg";
import { ContentContainer } from "~/components";

const Willkommen: StepComponentFunction = () => {
  return (
    <ContentContainer size="sm-md">
      <UebersichtStep imageSrc={welcomeImage} smallImageSrc={welcomeImageSmall}>
        <IntroText>
          Wir führen Sie mit einfachen Fragen und Hilfestellungen auf jeder
          Seite durch Ihre Erklärung zur Feststellung des Grundsteuerwerts.
        </IntroText>

        <SubHeadline>Welche Unterlagen brauchen Sie?</SubHeadline>
        <IntroText>
          <ul className="font-bold list-disc pl-24">
            <li className="mb-16">
              Informationsschreiben Ihres Bundeslandes ggf. mit beigefügtem
              Beiblatt oder Datenstammblatt
            </li>
            <li className="mb-16">
              Grundsteuerportal (Geodatenportal) Ihres Bundeslandes
            </li>
            <li className="mb-48">
              Optional: Grundbuchauszug, Einheitswertbescheid,
              Kauf-/Schenkungsvertrag, Teilungserklärung bei Wohnungseigentum
              oder Bau-/Vermessungsunterlagen
            </li>
          </ul>
        </IntroText>

        <SubHeadline>Wichtige Hinweise:</SubHeadline>
        <IntroText>
          <ol className="mb-32 ml-[15px]">
            <li className="mb-16 flex">
              <div className="mr-16 enumerate-icon">1</div>
              <div>
                Alle Angaben beziehen sich auf den Zustand Ihres Grundstücks am
                01.01.2022. Fragen Sie sich bei den Angaben also zum Beispiel
                “Wie sah mein Grundstück am 01.01.2022 aus?”
              </div>
            </li>
            <li className="mb-16 flex">
              <div className="mr-16 enumerate-icon">2</div>
              <div>
                Sie können die Bearbeitung unterbrechen und zu einem späteren
                Zeitpunkt fortführen. Bitte beachten Sie, das die Bearbeitung
                nur mit dem Gerät und Browser möglich ist, mit denen Sie sich
                angemeldet haben.
              </div>
            </li>
            <li className="mb-16 flex">
              <div className="mr-16 enumerate-icon">3</div>
              <div>
                Für jedes Grundstück müssen Sie eine eigene Grundsteuererklärung
                abgeben. Unter Grundstück versteht man zusammengehörende
                Grundstücksflächen, wie zum Beispiel direkt
                nebeneinanderliegende Haus- und Gartengründstücke.
              </div>
            </li>
          </ol>
        </IntroText>
      </UebersichtStep>
    </ContentContainer>
  );
};

export default Willkommen;
