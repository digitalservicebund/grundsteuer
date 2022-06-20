import Accordion from "~/components/Accordion";

export default function FaqAccordion() {
  const items = [
    {
      header: "Wie kann ich mich auf die Abgabe der Erklärung vorbereiten?",
      content: (
        <>
          <p className="mb-24">
            Für die Abgabe der Erklärung mit „Grundsteuererklärung für
            Privateigentum“ benötigen Sie insbesondere folgende Angaben:
          </p>
          <ul className="pl-24 mb-24 list-disc">
            <li>Größe des Grundstücks</li>
            <li>
              Grundbuchblattnummer (falls zur Hand), Gemarkung, Flur, Flurstück
            </li>
            <li>
              <i>Für Eigentumswohnungen:</i> Miteigentumsanteil am Grundstück
            </li>
            <li>Steuernummer / Aktenzeichen des Grundstücks</li>
            <li>Bodenrichtwert</li>
            <li>genaues Baujahr des Gebäudes (ab einem Baujahr von 1949)</li>
            <li>Wohnfläche</li>
            <li>Anzahl der Garagenstellplätze</li>
            <li>
              Kontaktdaten der Eigentümer:innen und deren Anteile am Eigentum.
            </li>
          </ul>
          <p className="mb-24">
            Überprüfen Sie, welche Angaben Sie schon haben und was Ihnen noch
            fehlt. Bitte reichen Sie keine Unterlagen mit Ihrer
            Grundsteuererklärung ein. Sollte das Finanzamt Unterlagen von Ihnen
            für die Prüfung benötigen, wird es diese bei Ihnen gesondert
            anfordern. Bitte bewahren Sie daher vorhandene Unterlagen sorgfältig
            auf.
          </p>
          <p className="mb-24">
            Überprüfen Sie, welche Angaben Sie schon haben und was Ihnen noch
            fehlt. Bitte reichen Sie keine Unterlagen mit Ihrer
            Grundsteuererklärung ein. Sollte das Finanzamt Unterlagen von Ihnen
            für die Prüfung benötigen, wird es diese bei Ihnen gesondert
            anfordern. Bitte bewahren Sie daher vorhandene Unterlagen sorgfältig
            auf.
          </p>
          <p className="mb-24">
            Die Unterlagen und Quellen, die für das Ausfüllen der
            Grundsteuererklärung hilfreich sind, unterscheiden sich nach dem
            Bundesland, in dem Ihr Grundstück liegt. Mit einem Klick auf das
            Bundesland gelangen Sie zu der jeweiligen Internetseite dieses
            Bundeslandes, auf welcher Sie weitere Informationen zur
            Grundsteuerreform finden.
          </p>
          <ul className="pl-24 list-disc">
            <li>
              <b>
                Grundstücke in{" "}
                <a
                  href={"https://www.berlin.de/grundsteuer"}
                  rel="noopener"
                  target="_blank"
                  className="text-blue-800 underline"
                >
                  Berlin
                </a>
              </b>
              : Geoportal (
              <a
                href={"https://fbinter.stadt-berlin.de/fb/index.jsp"}
                rel="noopener"
                target="_blank"
                className="text-blue-800 underline"
              >
                FIS-Broker
              </a>
              ), Bodenrichtwert vom BORIS-Portal, Grundbuchauszug, ggf.
              Teilungserkärung bei Wohnungseigentum, Bauunterlagen /
              Kauf-/Schenkungsvertrag (optional)
            </li>
            <li>
              <b>
                Grundstücke in{" "}
                <a
                  href={"https://grundsteuer.brandenburg.de/"}
                  rel="noopener"
                  target="_blank"
                  className="text-blue-800 underline"
                >
                  Brandenburg
                </a>
              </b>
              : Informationsschreiben des Landes, Grundstücksdaten aus dem{" "}
              <a
                href={
                  "https://informationsportal-grundstuecksdaten.brandenburg.de/"
                }
                rel="noopener"
                target="_blank"
                className="text-blue-800 underline"
              >
                Geoviewer Brandenburg
              </a>
              , Grundbuchauszug (optional), ggf. Teilungserklärung bei
              Wohnungseigentum, Einheitswertbescheid (optional), Bauunterlagen /
              Kauf-/Schenkungsvertrag (optional){" "}
            </li>
            <li>
              <b>
                Grundstücke in{" "}
                <a
                  href={"http://www.grundsteuer.bremen.de/"}
                  rel="noopener"
                  target="_blank"
                  className="text-blue-800 underline"
                >
                  Bremen
                </a>
              </b>
              : Informationsschreiben des Landes, Grundstücksdaten aus dem{" "}
              <a
                href={"https://geoportal.bremen.de/flurstuecksviewer/"}
                rel="noopener"
                target="_blank"
                className="text-blue-800 underline"
              >
                Flurstücksviewer Bremen
              </a>
              , Bodenrichtwert vom{" "}
              <a
                href={
                  "https://immobilienmarkt.niedersachsen.de/bodenrichtwerte?teilmarkt=Bauland&stichtag=2022-01-01&zoom=7.00"
                }
                rel="noopener"
                target="_blank"
                className="text-blue-800 underline"
              >
                Immobilienmarkt Niedersachsen
              </a>
              , Grundbuchauszug (optional), ggf. Teilungserklärung bei
              Wohnungseigentum (optional), Bauunterlagen /
              Kauf-/Schenkungsvertrag (optional){" "}
            </li>
            <li>
              <b>
                Grundstücke in{" "}
                <a
                  href={
                    "https://www.steuerportal-mv.de/Steuerrecht/Rund-ums-Grundst%C3%BCck/Grundsteuerreform/"
                  }
                  rel="noopener"
                  target="_blank"
                  className="text-blue-800 underline"
                >
                  Mecklenburg-Vorpommern
                </a>
              </b>
              : Informationsschreiben des Landes, Grundstücksdaten aus dem{" "}
              <a
                href={
                  "https://www.geodaten-mv.de/grundsteuerdaten/Karten/Grundvermoegen"
                }
                rel="noopener"
                target="_blank"
                className="text-blue-800 underline"
              >
                Geoviewer Mecklenburg-Vorpommern
              </a>
              , Grundbuchauszug (optional), ggf. Teilungserklärung bei
              Wohnungseigentum, Bauunterlagen / Kauf-/Schenkungsvertrag
              (optional)
            </li>
            <li>
              <b>
                Grundstücke in{" "}
                <a
                  href={"http://www.grundsteuer.nrw.de/"}
                  rel="noopener"
                  target="_blank"
                  className="text-blue-800 underline"
                >
                  Nordrhein-Westfalen
                </a>
              </b>
              : Informationsschreiben der Finanzämter inkl. beigefügtes
              Datenstammblatt, Grundstücksdaten aus dem{" "}
              <a
                href={"https://grundsteuer-geodaten.nrw.de/"}
                rel="noopener"
                target="_blank"
                className="text-blue-800 underline"
              >
                Grundsteuerportal (Geodatenportal)
              </a>
              , ggf. Teilungserklärung bei Wohnungseigentum oder
              Kauf-/Schenkungsvertrag
            </li>
            <li>
              <b>
                Grundstücke in{" "}
                <a
                  href={"https://www.fin-rlp.de/grundsteuer"}
                  rel="noopener"
                  target="_blank"
                  className="text-blue-800 underline"
                >
                  Rheinland-Pfalz
                </a>
              </b>
              : Informationsschreiben des Landes inkl. beigefügtes
              Datenstammblatt, Bodenrichtwerte in Rheinland-Pfalz aus dem{" "}
              <a
                href={"https://www.maps.rlp.de"}
                rel="noopener"
                target="_blank"
                className="text-blue-800 underline"
              >
                GeoBasisViewer
              </a>
              , Bauunterlagen / Kauf-/Schenkungsvertrag (optional),{" "}
            </li>
            <li>
              <b>
                Grundstücke in{" "}
                <a
                  href={
                    "https://www.saarland.de/mfe/DE/portale/steuernundfinanzaemter/Grundsteuerreform/Grundsteuerreform.html"
                  }
                  rel="noopener"
                  target="_blank"
                  className="text-blue-800 underline"
                >
                  Saarland
                </a>
              </b>
              : Informationsschreiben des Landes inkl. beigefügtes Datenblatt,
              Grundstücksdaten aus dem Grundsteuerviewer im{" "}
              <a
                href={"https://geoportal.saarland.de/Grundsteuer/"}
                rel="noopener"
                target="_blank"
                className="text-blue-800 underline"
              >
                Geoportal des Saarlandes
              </a>
              , Bauunterlagen / Kauf-/Schenkungsvertrag (optional)
            </li>
            <li>
              <b>
                Grundstücke in{" "}
                <a
                  href={"https://www.grundsteuer.sachsen.de/"}
                  rel="noopener"
                  target="_blank"
                  className="text-blue-800 underline"
                >
                  Sachsen
                </a>
              </b>
              : Informationsschreiben des Landes, Grundstücksdaten und
              Bodenrichtwert aus dem{" "}
              <a
                href={
                  "https://www.finanzamt.sachsen.de/grundsteuerportal-sachsen-flurstuecksinformationen-11764.html"
                }
                rel="noopener"
                target="_blank"
                className="text-blue-800 underline"
              >
                Grundsteuerportal Sachsen
              </a>
              , ggf. Grundbuchauszug, Bauunterlagen / Kauf-/Schenkungsvertrag
            </li>
            <li>
              <b>
                Grundstücke in{" "}
                <a
                  href={"https://mf.sachsen-anhalt.de/steuern/grundsteuer/"}
                  rel="noopener"
                  target="_blank"
                  className="text-blue-800 underline"
                >
                  Sachsen-Anhalt
                </a>
              </b>
              : Informationsschreiben des Landes, Grundstücksdaten aus dem{" "}
              <a
                href={"https://www.grundsteuerdaten.sachsen-anhalt.de/"}
                rel="noopener"
                target="_blank"
                className="text-blue-800 underline"
              >
                Grundsteuer-Viewer Sachsen-Anhalt
              </a>
              , Grundbuchauszug (optional), ggf. Teilungserklärung bei
              Wohnungseigentum (optional), Bauunterlagen /
              Kauf-/Schenkungsvertrag (optional)
            </li>
            <li>
              <b>
                Grundstücke in{" "}
                <a
                  href={"https://www.schleswig-holstein.de/grundsteuer"}
                  rel="noopener"
                  target="_blank"
                  className="text-blue-800 underline"
                >
                  Schleswig-Holstein
                </a>
              </b>
              : Informationsschreiben des Landes, Grundstücksdaten aus dem
              Grundsteuerportal Schleswig-Holstein (noch in Entwicklung),
              Grundbuchauszug (optional), ggf. Teilungserklärung bei
              Wohnungseigentum, Bauunterlagen / Kauf-/Schenkungsvertrag
              (optional)
            </li>
            <li>
              <b>
                Grundstücke in{" "}
                <a
                  href={"https://grundsteuer.thueringen.de/"}
                  rel="noopener"
                  target="_blank"
                  className="text-blue-800 underline"
                >
                  Thüringen
                </a>
              </b>
              : Informationsschreiben des Landes einschließlich Beiblatt,
              Grundstücksdaten aus dem{" "}
              <a
                href={
                  "https://thueringenviewer.thueringen.de/thviewer/grundsteuer.html"
                }
                rel="noopener"
                target="_blank"
                className="text-blue-800 underline"
              >
                Grundsteuer Viewer Thüringen (Bereitstellung ab 1. Juli 2022)
              </a>
              , Grundbuchauszug (optional), ggf. Teilungserklärung bei
              Wohnungseigentum (optional) Bauunterlagen /
              Kauf-/Schenkungsvertrag (optional)
            </li>
          </ul>
        </>
      ),
    },
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
          <ul className="pl-24 mb-24 list-disc">
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
            Ab Juli 2022 können Sie auf dieser Seite mit Hilfe weniger Fragen
            überprüfen, ob die Nutzung für Sie infrage kommt.
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
          <ul className="pl-24 mb-24 list-disc">
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
              className="text-blue-800 underline"
            >
              ELSTER
            </a>
            . Ab Juli 2022 können Sie auf dieser Seite mit Hilfe weniger Fragen
            überprüfen, ob die Nutzung für Sie infrage kommt.
          </p>
        </>
      ),
    },
    {
      header:
        "In welchem Bundesland muss ein Grundstück liegen, damit es für „Grundsteuererklärung für Privateigentum“ infrage kommt?",
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
            <strong> nicht</strong> verwendet werden. Für diese Länder gibt es
            zum Beispiel{" "}
            <a
              className="text-blue-900"
              href={"https://www.elster.de/eportal/infoseite/grundsteuerreform"}
            >
              ELSTER
            </a>
            .
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
      header: "Brauche ich ein ELSTER-Konto?",
      content: (
        <>
          <p>
            Nein, Sie brauchen kein ELSTER-Konto, um den Service
            „Grundsteuererklärung für Privateigentum“ nutzen zu können.
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
            „Grundsteuererklärung für Privateigentum“ wurde vom{" "}
            <a
              href="https://digitalservice.bund.de"
              target="_blank"
              rel="noopener"
              className="text-blue-800 underline"
            >
              DigitalService
            </a>{" "}
            – einer GmbH, deren 100%-iger Anteilseigner der Bund ist – im
            Auftrag des{" "}
            <a
              href="https://www.bundesfinanzministerium.de"
              target="_blank"
              rel="noopener"
              className="text-blue-800 underline"
            >
              Bundesfinanzministeriums
            </a>{" "}
            entwickelt. Zuvor hat DigitalService{" "}
            <a
              href="https://www.steuerlotse-rente.de"
              target="_blank"
              rel="noopener"
              className="text-blue-800 underline"
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
              className="text-blue-800 underline"
            >
              Themenseite
            </a>{" "}
            des Bundesfinanzministeriums zur Reform der Grundsteuer unter der
            Rubrik{" "}
            <a
              href="https://bundesfinanzministerium.de/Web/DE/Themen/Steuern/Steuerarten/Grundsteuer_Grunderwerbsteuer/Grundsteuer_Grunderwerbsteuer.html"
              rel="noopener"
              target="_blank"
              className="text-blue-800 underline"
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
              className="text-blue-800 underline"
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
              className="text-blue-800 underline"
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
              className="text-blue-800 underline"
            >
              www.steuerchatbot.de
            </a>{" "}
            erreichen.
          </p>
        </>
      ),
    },
    {
      header:
        "Warum muss ich die Grundsteuererklärung abgeben, obwohl meine Daten der Finanzverwaltung vorliegen?",
      content: (
        <>
          <p className="mb-24">
            Es liegen der Finanzverwaltung nicht alle erforderlichen Daten über
            die Grundstücke und die darauf stehenden Gebäude in elektronisch
            verarbeitbarer Form vor. Deswegen kann die Finanzverwaltung zum
            jetzigen Zeitpunkt noch kein vollständig digitalisiertes
            Verwaltungsverfahren anbieten. Diese Daten müssen daher bei den
            Eigentümer:innen abgefragt werden.
          </p>
          <p>
            Der nächste Zeitpunkt der Hauptfeststellung ist in 7 Jahren, also im
            Jahr 2029. Bis dahin soll das Verfahren digitalisiert werden. Das
            bedeutet, dass die Eigentümer:innen dann keine
            Hauptfeststellungserklärung mehr abgeben müssen.
          </p>
        </>
      ),
    },
  ];

  return <Accordion {...{ items, boldAppearance: true }} />;
}
