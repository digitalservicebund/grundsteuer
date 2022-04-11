import Accordion from "~/components/Accordion";

export default function FaqAccordion() {
  const items = [
    {
      header:
        "Welche Eigentumsverhältnisse deckt „Grundsteuererklärung für Privateigentum“ ab?",
      content: (
        <>
          <p className="mb-24">
            „Grundsteuererklärung für Privateigentum“ deckt eher{" "}
            <strong>einfache</strong> Eigentumsverhältnisse von{" "}
            <strong>Privatpersonen</strong> ab, zum Beispiel:
          </p>
          <ul className="mb-24 list-disc pl-24">
            <li>
              Ein Ehepaar besitzt ein Grundstück mit einem Einfamilienhaus, in
              dem es selber wohnt, einem Garagenstellplatz und einem Garten;
            </li>
            <li>
              Ein Ehepaar und zwei Freunde von ihnen besitzen ein
              Zweifamilienhaus und vermieten eine von den beiden Wohnungen;
            </li>
            <li>Ein nicht verheiratetes Paar besitzt eine Eigentumswohnung;</li>
            <li>
              Ein:e Alleineigentümer:in besitzt ein unbebautes Grundstück.{" "}
            </li>
          </ul>
          <p>
            Wenn „Grundsteuererklärung für Privateigentum“ live geht, können Sie
            auf dieser Seite mit Hilfe weniger Fragen überprüfen, ob die Nutzung
            für Sie infrage kommt.
          </p>
        </>
      ),
    },
    {
      header:
        "Welche Eigentumsverhältnisse deckt „Grundsteuererklärung für Privateigentum“ nicht ab?",
      content: (
        <>
          <p className="mb-24">
            „Grundsteuererklärung für Privateigentum“ deckt eher{" "}
            <strong>komplizierte</strong> Eigentumsverhältnisse nicht ab, zum
            Beispiel:
          </p>
          <ul className="mb-24 list-disc pl-24">
            <li>
              Eigentum einer juristischen Person (Firma oder Unternehmen);
            </li>
            <li>Grundstücke mit Gebäuden mit mehr als zwei Wohnungen;</li>
            <li>Betriebe der Land- und Forstwirtschaft;</li>
            <li>Erbengemeinschaften;</li>
            <li>
              steuerbefreites oder -begünstigtes Eigentum (z.B. Denkmalschutz);
            </li>
            <li>Eigentümer:innen mit Wohnsitz im Ausland.</li>
          </ul>
          <p>
            Für diese Fälle gibt es{" "}
            <a
              href="https://www.elster.de"
              rel="noopener"
              target="_blank"
              className="underline text-blue-800"
            >
              ELSTER
            </a>
            . Wenn „Grundsteuererklärung für Privateigentum“ live geht, können
            Sie auf dieser Seite mit Hilfe weniger Fragen überprüfen, ob die
            Nutzung für Sie infrage kommt.
          </p>
        </>
      ),
    },
    {
      header:
        "Eigentümer:innen aus welchen Bundesländern können „Grundsteuererklärung für Privateigentum“ nutzen?",
      content: (
        <>
          <p className="mb-24">
            „Grundsteuererklärung für Privateigentum“ ist für Menschen nutzbar,
            die in Bundesländern wohnen, die sich für das sogenannte
            „Bundesmodell“ entschieden haben. Das sind folgende 11 Bundesländer:
            Berlin, Brandenburg, Bremen, Mecklenburg-Vorpommern,
            Nordrhein-Westfalen, Rheinland-Pfalz, Saarland, Sachsen,
            Sachsen-Anhalt, Schleswig-Holstein, Thüringen.
          </p>

          <p>
            Für Eigentümer:innen aus Baden-Württemberg, Bayern, Hessen, Hamburg,
            Niedersachsen ist „Grundsteuererklärung für Privateigentum“ leider{" "}
            <strong>nicht</strong> geeignet. Für diese Länder gibt es ELSTER.
          </p>
        </>
      ),
    },
    {
      header:
        "Ab wann kann ich „Grundsteuererklärung für Privateigentum“ nutzen?",
      content: (
        <>
          <p>
            Der Online-Service „Grundsteuererklärung für Privateigentum“ geht
            Anfang Juli 2022 online. Die Grundsteuererklärung muss muss im
            Zeitraum vom 1. Juli bis 31. Oktober 2022 abgegeben werden.
          </p>
        </>
      ),
    },
    {
      header:
        "In meinem Informationsschreiben steht, ich soll die Erklärung über ELSTER abgeben. Darf ich „Grundsteuererklärung für Privateigentum“ trotzdem nutzen?",
      content: (
        <>
          <p>
            Ja, das dürfen Sie. „Grundsteuererklärung für Privateigentum“ ist
            ein vereinfachtes und nutzerfreundliches Formular, das die Daten
            direkt an ELSTER über die offizielle Schnittstelle übermittelt.
          </p>
        </>
      ),
    },
    {
      header: "Ist „Grundsteuererklärung für Privateigentum“ kostenlos?",
      content: (
        <>
          <p>Ja, unser Service ist kostenlos.</p>
        </>
      ),
    },
    {
      header:
        "Kann ich „Grundsteuererklärung für Privateigentum“ nutzen, wenn ich mehrere Grundstücke habe?",
      content: (
        <>
          <p>
            Es kommt darauf an, wo Ihre Grundstücke sich befinden. Wenn Sie
            mehrere Grundstücke in den Bundesmodell-Ländern haben, können Sie
            „Grundsteuererklärung für Privateigentum“ nutzen, indem Sie die
            Erklärungen nacheinander abgeben. Wenn eins von Ihren Grundstücken
            in Baden-Württemberg, Bayern, Hessen, Hamburg oder Niedersachsen
            liegt, müssen Sie die Erklärung für dieses Grundstück über ELSTER
            abgeben.
          </p>
        </>
      ),
    },
    {
      header: "Wer hat „Grundsteuererklärung für Privateigentum“  entwickelt?",
      content: (
        <>
          <p>
            „Grundsteuererklärung für Privateigentum“ wurde von{" "}
            <a
              href="https://digitalservice.bund.de"
              target="_blank"
              rel="noopener"
              className="underline text-blue-800"
            >
              Digitalservice4Germany
            </a>{" "}
            – einer Bundes GmbH – im Auftrag des{" "}
            <a
              href="https://www.bundesfinanzministerium.de"
              target="_blank"
              rel="noopener"
              className="underline text-blue-800"
            >
              Bundesfinanzministerium
            </a>{" "}
            entwickelt. Zuvor hat Digitalservice4Germany{" "}
            <a
              href="https://www.steuerlotse-rente.de"
              target="_blank"
              rel="noopener"
              className="underline text-blue-800"
            >
              den Steuerlotsen für Rente und Pension
            </a>{" "}
            entwickelt.
          </p>
        </>
      ),
    },
    {
      header: "Wo kann ich mehr über die Grundsteuerreform erfahren?",
      content: (
        <>
          <p>
            Die offiziellen Informationen über die Grundsteuerreform für Ihr
            Bundesland finden Sie unter{" "}
            <a
              href="https://www.grundsteuerreform.de"
              rel="noopener"
              target="_blank"
              className="underline text-blue-800"
            >
              www.grundsteuerreform.de
            </a>
            .
          </p>
        </>
      ),
    },
    {
      header: "Wie kann ich mich auf die Abgabe der Erklärung vorbereiten?",
      content: (
        <>
          <p className="mb-24">
            Wenn Sie sich vorbereiten wollen, können Sie jetzt schon Folgendes
            tun:
          </p>
          <ul className="list-disc pl-24">
            <li>
              Suchen Sie in Ihren Unterlagen Ihren{" "}
              <strong>Grundbuchauszug</strong> heraus. Falls sie ihn nicht
              haben, beantragen Sie ihn in Ihrem Grundbuchamt. Der
              Grundbuchauszug ist für die Grundsteuererklärung äußerst
              hilfreich.
            </li>
            <li>
              Folgende Unterlagen können das Ausfüllen erleichtern: der{" "}
              <strong>Einheitswertbescheid</strong>, der{" "}
              <strong>Kaufvertrag</strong>, die <strong>Bauunterlagen</strong>,
              das{" "}
              <strong>
                Informationsschreiben Ihrer Landesfinanzverwaltung
              </strong>
              .
            </li>
          </ul>
        </>
      ),
    },
  ];

  return <Accordion {...{ items, boldAppearance: true }} />;
}
