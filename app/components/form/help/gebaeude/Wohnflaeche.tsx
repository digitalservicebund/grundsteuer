import DefaultHelpContent, {
  HelpComponentFunction,
} from "~/components/form/help/Default";
import wohnflaecheImg from "~/assets/images/help/help-gebaeude-wohnflaeche.png";

const WohnflaecheHelp: HelpComponentFunction = () => {
  return (
    <DefaultHelpContent
      elements={[
        {
          type: "paragraph",
          value: (
            <>
              Die Anrechnung der Grundflächen erfolgt je nach Raumhöhe.
              Raumhöhen unter einem Meter werden gar nicht und Raumhöhen von
              einem bis zwei Metern nur zu 50% angerechnet.
              <br />
              Weitere Beispiele für die Ermittlung der Wohn- und Nutzflächen
              finden Sie{" "}
              <a
                href="https://grundsteuererklaerung-fuer-privateigentum.zammad.com/help/de-de/14-konkrete-felder-im-formular/52-was-gehort-zur-wohn-und-nutzflache-und-wie-kann-ich-sie-richtig-bemessen"
                target="_blank"
                rel="noopener"
                className="underline font-bold"
              >
                in unserem Hilfebereich
              </a>
              .
            </>
          ),
        },
        {
          type: "image",
          source: wohnflaecheImg,
          altText:
            "Schematische Darstellung eines Hauses mit Anrechnungshöhen pro Bereich.",
        },
      ]}
    />
  );
};

export default WohnflaecheHelp;
