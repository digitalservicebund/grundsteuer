import { StepComponentFunction } from "~/routes/formular/_step";
import SubHeadline from "../SubHeadline";
import UebersichtStep from "~/components/form/UebersichtStep";
import welcomeImage from "~/assets/images/uebersicht-willkommen.svg";
import { ContentContainer } from "~/components";
import HintBubble from "~/components/HintBubble";
import datenstammblat from "~/assets/images/willkommen-datenstammblatt.png";
import grundbuchauszug from "~/assets/images/willkommen-grundbuchauszug.png";

const Willkommen: StepComponentFunction = () => {
  return (
    <>
      <ContentContainer size="sm-md">
        <UebersichtStep imageSrc={welcomeImage}>
          <HintBubble index="1" className="mt-16" />
          <SubHeadline>
            Diese Unterlagen helfen Ihnen beim Ausfüllen der Erklärung
          </SubHeadline>
          <ul className="list-disc pl-24">
            <li className="mb-16">
              Falls erhalten: Informationsschreiben Ihres Bundeslandes mit
              beigefügtem Beiblatt oder Datenstammblatt
            </li>
            <li>
              Optional: Grundbuchauszug, Einheitswertbescheid, Kauf- oder
              Schenkungsvertrag, Teilungserklärung bei Wohnungseigentum oder
              Bau- oder Vermessungsunterlagen
            </li>
          </ul>

          <HintBubble index="2" className="mt-40" />
          <SubHeadline>
            Was ist ein Flurstück und wie erkenne ich, dass es zu meinem
            Grundstück gehört?
          </SubHeadline>
          <p>
            In Ihrem Grundbuchauszug (oder falls erhalten Datenstammblatt) sind
            sogenannte Flurstücke aufgelistet. Jede Zeile im Grundbuchauszug
            steht für ein eigenes Flurstück. Zusammen ergeben Flurstücke ein
            Grundstück oder fachlich ausgedrückt, eine “wirtschaftliche
            Einheit”. Manchmal sind Flurstücke auf einem- oder mehreren
            Grundbuchauszügen vermerkt. In der Regel gilt: Nutzen Sie die
            Flurstücke zusammen – zum Beispiel Garage, Zufahrt und Haus – dann
            bilden diese eine wirtschaftliche Einheit, für die Sie diese
            Erklärung abgeben.
          </p>
        </UebersichtStep>
      </ContentContainer>
      <div className="flex flex-col gap-y-64 flex-grow-0 lg:flex-row mb-96">
        <div>
          <img
            src={datenstammblat}
            alt="Beispiel für ein Datenstammblatt"
            className="mr-24"
          />
        </div>
        <div>
          <img
            src={grundbuchauszug}
            alt="Beispiel für ein Grundbuchauszug"
            className="mr-24"
          />
        </div>
      </div>
      <div className="mb-32">
        Bei Fragen oder Unsicherheiten, schauen Sie gern in unserem{" "}
        <a
          href="https://grundsteuererklaerung-fuer-privateigentum.zammad.com/help/de-de/4-allgemeines-zur-grundsteuererklarung/145-wie-viele-erklarungen-gebe-ich-wann-ab"
          className="underline font-bold"
          target="_blank"
        >
          Hilfebereich
        </a>{" "}
        nach.
      </div>
    </>
  );
};

export default Willkommen;
