import Accordion from "~/components/Accordion";

export default function FaqAccordion() {
  const items = [
    {
      header:
        "Welche Sachverhalte deckt „Grundsteuererklärung für Privateigentum“ ab?",
      content: (
        <>
          <p className="mb-24">
            „Grundsteuererklärung für Privateigentum“ deckt eher{" "}
            <strong>einfache</strong> Sachverhalte von{" "}
            <strong>Privatpersonen</strong> ab, zum Beispiel:
          </p>
          <ul className="mb-24 list-disc pl-24">
            <li>
              Ein Ehepaar ist Eigentümer eines Grundstücks mit einem
              Einfamilienhaus, in dem es selbst wohnt, einem Garagenstellplatz
              und einem Garten;
            </li>
            <li>
              ein Ehepaar und zwei Freunde von ihnen sind Eigentümer einer
              Wohnung und vermieten diese;
            </li>
            <li>ein nicht verheiratetes Paar ist Eigentümer einer Wohnung;</li>
            <li>
              eine Einzelperson ist Alleineigentümer:in eines unbebauten
              Grundstücks.
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
        "Welche Sachverhalte deckt „Grundsteuererklärung für Privateigentum“ nicht ab?",
      content: (
        <>
          <p className="mb-24">
            „Grundsteuererklärung für Privateigentum“ deckt seltenere oder
            komplexere Sachverhalte noch nicht ab, zum Beispiel:
          </p>
          <ul className="mb-24 list-disc pl-24">
            <li>
              Das Grundstück gehört zu einem Betrieb der Land- und
              Forstwirtschaft.
            </li>
            <li>
              Das Grundstück ist ein Mietwohngrundstück (Mehrfamilienhaus;
              Gebäude mit mehr als zwei Wohnungen) oder gehört zu den sog.
              Nichtwohngrundstücken (gemischt genutzte Grundstücke,
              Geschäftsgrundstücke, sonstige Grundstücke).
            </li>
            <li>Das Grundstück ist von der Grundsteuer befreit.</li>
            <li>
              Eigentümer:in des Grundstücks ist eine Erbengemeinschaft oder eine
              Person mit Wohnsitz im Ausland.
            </li>
            <li>
              Eigentümer:innen des Grundstücks sind keine natürlichen Personen
              (institutionelle Eigentümer, Kapitalgesellschaften,
              Personengesellschaften).
            </li>
          </ul>
          <p>
            Für diese Fälle gibt es zum Beispiel{" "}
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
        "Eigentümer:innen von Grundstücken in welchen Bundesländern können „Grundsteuererklärung für Privateigentum“ nutzen?",
      content: (
        <>
          <p className="mb-24">
            „Grundsteuererklärung für Privateigentum“ ist für Eigentümer:innen
            von Grundstücken in Bundesländern, die sich bei der Grundsteuer für
            das sogenannte „Bundesmodell“ entschieden haben, nutzbar. Das sind
            folgende elf Bundesländer: Berlin, Brandenburg, Bremen,
            Mecklenburg-Vorpommern, Nordrhein-Westfalen, Rheinland-Pfalz,
            Saarland, Sachsen, Sachsen-Anhalt, Schleswig-Holstein, Thüringen.
          </p>

          <p>
            Für Grundstücke in Baden-Württemberg, Bayern, Hamburg, Hessen und
            Niedersachsen kann „Grundsteuererklärung für Privateigentum“ leider{" "}
            <strong>noch nicht</strong> verwendet werden. Für diese Länder gibt
            es zum Beispiel ELSTER.
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
            Anfang Juli 2022 online. Die Grundsteuererklärung muss im Zeitraum
            vom 1. Juli bis 31. Oktober 2022 abgegeben werden.
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
            direkt über die offizielle ELSTER-Schnittstelle an die
            Finanzverwaltung übermittelt.
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
            Es kommt darauf an, wo sich Ihre Grundstücke befinden. Wenn Sie
            mehrere Grundstücke in den Bundesmodell-Ländern haben, können Sie
            „Grundsteuererklärung für Privateigentum“ nutzen, indem Sie die
            Erklärungen nacheinander abgeben. Wenn eines der Grundstücke in
            Baden-Württemberg, Bayern, Hamburg, Hessen oder Niedersachsen liegt,
            müssen Sie die Erklärung für dieses Grundstück zum Beispiel über
            ELSTER abgeben.
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
              DigitalService4Germany
            </a>{" "}
            – einer GmbH, deren 100%-iger Anteilseigner der Bund ist – im
            Auftrag des{" "}
            <a
              href="https://www.bundesfinanzministerium.de"
              target="_blank"
              rel="noopener"
              className="underline text-blue-800"
            >
              Bundesfinanzministeriums
            </a>{" "}
            entwickelt. Zuvor hat DigitalService4Germany{" "}
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
          <p className="mb-24">
            Weitere Informationen zur Grundsteuerreform finden Sie zum Beispiel
            auf der{" "}
            <a
              href="https://bundesfinanzministerium.de/Content/DE/Standardartikel/Themen/Steuern/Steuerarten/Grundsteuer-und-Grunderwerbsteuer/reform-der-grundsteuer.html"
              rel="noopener"
              target="_blank"
              className="underline text-blue-800"
            >
              Themenseite
            </a>{" "}
            des Bundesfinanzministeriums zur Reform der Grundsteuer unter der
            Rubrik{" "}
            <a
              href="https://bundesfinanzministerium.de/Web/DE/Themen/Steuern/Steuerarten/Grundsteuer_Grunderwerbsteuer/Grundsteuer_Grunderwerbsteuer.html"
              rel="noopener"
              target="_blank"
              className="underline text-blue-800"
            >
              Themen {">"} Steuern {">"} Steuerarten {">"} Grundsteuer &
              Grunderwerbsteuer
            </a>
            . Antworten des Bundesfinanzministeriums auf Fragen zur
            Grundsteuerreform finden Sie unter der Rubrik{" "}
            <a
              href="https://bundesfinanzministerium.de/Content/DE/FAQ/2019-06-21-faq-die-neue-grundsteuer.html"
              rel="noopener"
              target="_blank"
              className="underline text-blue-800"
            >
              Service {">"} FAQ/Glossar {">"} FAQ
            </a>
            .
          </p>
          <p className="mb-24">
            Weitere offizielle Informationen über die Grundsteuerreform für Ihr
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
          <p>
            Bei Fragen rund um das Thema Grundsteuer unterstützt Sie auch der
            virtuelle Assistent der Steuerverwaltung, den Sie unter{" "}
            <a
              href="https://www.steuerchatbot.de"
              rel="noopener"
              target="_blank"
              className="underline text-blue-800"
            >
              www.steuerchatbot.de
            </a>{" "}
            erreichen.
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
          <ul className="list-disc pl-24 mb-24">
            <li>
              Suchen Sie in Ihren Unterlagen Ihren{" "}
              <strong>Grundbuchauszug</strong> heraus. Falls sie ihn nicht
              haben, können Sie ihn in Ihrem Grundbuchamt beantragen. Der
              Grundbuchauszug ist für die Grundsteuererklärung äußerst
              hilfreich.
            </li>
            <li>
              Folgende Unterlagen können das Ausfüllen erleichtern: der letzte{" "}
              <strong>Einheitswertbescheid</strong>, der{" "}
              <strong>Kaufvertrag</strong> über das Grundstück, die{" "}
              <strong>Bauunterlagen</strong> zu dem Gebäude und (soweit
              vorhanden) das{" "}
              <strong>
                Informationsschreiben Ihrer Landesfinanzverwaltung
              </strong>
              .
            </li>
            <li>
              Einige Länder bieten sog. Grundsteuerviewer über das Internet an,
              mit denen Sie relevante Daten zu ihrem Grundstück erfahren können
              (Grundstücksfläche, Bodenrichtwert usw.). Teilweise bieten diese
              Seiten Ihnen eine Downloadfunktion mit den erforderlichen Daten zu
              ihrem Grundstück in einem pdf-Format an.
            </li>
          </ul>
          <p className="mb-24">
            Für die Abgabe der Erklärung mit „Grundsteuererklärung für
            Privateigentum“ benötigen Sie nur wenige Angaben, die Sie z. B. mit
            Hilfe der vorgenannten Unterlagen zur Vorbereitung bereits jetzt
            heraussuchen können. Sie benötigen insbesondere
          </p>
          <ul className="list-disc pl-24">
            <li>die Größe des Grundstücks,</li>
            <li>den Bodenrichtwert,</li>
            <li>die Wohnfläche,</li>
            <li>das Baujahr des Gebäudes (ab 1949),</li>
            <li>die Anzahl der Garagen- oder Tiefgaragenstellplätze,</li>
            <li>
              falls das Gebäude verbindlich abgerissen werden muss, das Jahr der
              Abbruchverpflichtung,
            </li>
            <li>
              falls das Gebäude kernsaniert wurde, das Jahr der Kernsanierung.
            </li>
          </ul>
        </>
      ),
    },
  ];

  return <Accordion {...{ items, boldAppearance: true }} />;
}
