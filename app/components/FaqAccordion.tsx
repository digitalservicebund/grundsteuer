import Accordion from "~/components/Accordion";

export default function FaqAccordion(props: { pruefenPath: string }) {
  const items = [
    {
      header: "Wie kann ich mich auf die Abgabe der Erklärung vorbereiten?",
      id: "vorbereitung",
      content: (
        <>
          <p>
            Für die Abgabe der Erklärung mit „Grundsteuererklärung für
            Privateigentum“ benötigen Sie insbesondere folgende Angaben:
          </p>
          <ul className="pl-24 mb-24 list-disc">
            <li>Größe des Grundstücks</li>
            <li>
              Grundbuchblattnummer (falls zur Hand), Gemarkung, Flur, Flurstück
            </li>
            <li>Für Eigentumswohnungen: Miteigentumsanteil am Grundstück</li>
            <li>Steuernummer / Aktenzeichen des Grundstücks</li>
            <li>Bodenrichtwert</li>
            <li>genaues Baujahr des Gebäudes (ab einem Baujahr von 1949)</li>
            <li>Wohnfläche</li>
            <li>Anzahl der Garagenstellplätze</li>
            <li>Steuer-Identifikationsnummer aller Eigentümer:innen</li>
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
            Die Unterlagen und Quellen, die für das Ausfüllen der
            Grundsteuererklärung hilfreich sind, unterscheiden sich nach dem
            Bundesland, in dem Ihr Grundstück liegt. Mit einem Klick auf das
            Bundesland gelangen Sie zu der jeweiligen Internetseite dieses
            Bundeslandes, auf welcher Sie weitere Informationen zur
            Grundsteuerreform finden.
          </p>
          <div className={"mb-16"}>
            <p>
              <strong>Berlin</strong>
              <br />
              Allgemeine Informationen:{" "}
              <a
                href={"https://www.berlin.de/grundsteuer"}
                rel="noopener"
                target="_blank"
                className="text-blue-800 underline font-bold"
              >
                Informationen für Grundstücke in Berlin
              </a>
              <br />
              Hier finden Sie benötigte Angaben:
            </p>
            <ul className={"list-disc pl-24"}>
              <li>
                Angaben zum Bodenrichtwert{" "}
                <a
                  href={"https://fbinter.stadt-berlin.de/boris/"}
                  rel="noopener"
                  target="_blank"
                  className="text-blue-800 underline font-bold"
                >
                  BORIS-Portal
                </a>
              </li>
              <li>
                Angaben zu Ihrem Grundstück:{" "}
                <a
                  href={"https://fbinter.stadt-berlin.de/fb/index.jsp"}
                  rel="noopener"
                  target="_blank"
                  className="text-blue-800 underline font-bold"
                >
                  Geoportal (FIS Broker)
                </a>
              </li>
              <li>
                Hilfreich sein können darüber hinaus: Grundbuchauszug, ggf.
                Teilungserklärung bei Wohnungseigentum, Bauunterlagen /
                Kauf-/Schenkungsvertrag (optional)
              </li>
            </ul>
          </div>
          <div className={"mb-16"}>
            <p>
              <strong>Brandenburg</strong>
              <br />
              Allgemeine Informationen:{" "}
              <a
                href={"https://grundsteuer.brandenburg.de/"}
                rel="noopener"
                target="_blank"
                className="text-blue-800 underline font-bold"
              >
                Informationen für Grundstücke in Brandenburg
              </a>
              <br />
              Hier finden Sie benötigte Angaben:
            </p>
            <ul className={"list-disc pl-24"}>
              <li>Informationsschreiben des Landes</li>
              <li>
                Angaben zu Ihrem Grundstück:{" "}
                <a
                  href={
                    "https://informationsportal-grundstuecksdaten.brandenburg.de/"
                  }
                  rel="noopener"
                  target="_blank"
                  className="text-blue-800 underline font-bold"
                >
                  Geoviewer Brandenburg
                </a>
              </li>
              <li>
                Sie benötigen darüber hinaus: Grundbuchauszug (optional), ggf.
                Teilungserklärung bei Wohnungseigentum, Einheitswertbescheid
                (optional), Bauunterlagen / Kauf-/Schenkungsvertrag (optional)
              </li>
            </ul>
          </div>
          <div className={"mb-16"}>
            <p>
              <strong>Bremen</strong>
              <br />
              Allgemeine Informationen:{" "}
              <a
                href={"http://www.grundsteuer.bremen.de/"}
                rel="noopener"
                target="_blank"
                className="text-blue-800 underline font-bold"
              >
                Informationen für Grundstücke in Bremen
              </a>
              <br />
              Hier finden Sie benötigte Angaben:
            </p>
            <ul className={"list-disc pl-24"}>
              <li>Informationsschreiben des Landes</li>
              <li>
                Angaben zu Ihrem Grundstück:{" "}
                <a
                  href={"https://geoportal.bremen.de/flurstuecksviewer/"}
                  rel="noopener"
                  target="_blank"
                  className="text-blue-800 underline font-bold"
                >
                  Flurstücksviewer Bremen
                </a>
              </li>
              <li>
                Angaben zu Ihrem Bodenrichtwert:{" "}
                <a
                  href={
                    "https://immobilienmarkt.niedersachsen.de/bodenrichtwerte?teilmarkt=Bauland&stichtag=2022-01-01&zoom=7.00"
                  }
                  rel="noopener"
                  target="_blank"
                  className="text-blue-800 underline font-bold"
                >
                  Immobilienmarkt Niedersachsen
                </a>
              </li>
              <li>
                Sie benötigen darüber hinaus: Grundbuchauszug (optional), ggf.
                Teilungserklärung bei Wohnungseigentum (optional), Bauunterlagen
                / Kauf-/Schenkungsvertrag (optional)
              </li>
            </ul>
          </div>
          <div className={"mb-16"}>
            <p>
              <strong>Mecklenburg-Vorpommern</strong>
              <br />
              Allgemeine Informationen:{" "}
              <a
                href={
                  "https://www.steuerportal-mv.de/Steuerrecht/Rund-ums-Grundst%C3%BCck/Grundsteuerreform/"
                }
                rel="noopener"
                target="_blank"
                className="text-blue-800 underline font-bold"
              >
                Informationen für Grundstücke in Mecklenburg-Vorpommern
              </a>
              <br />
              Hier finden Sie benötigte Angaben:
            </p>
            <ul className={"list-disc pl-24"}>
              <li>Informationsschreiben des Landes</li>
              <li>
                Angaben zu Ihrem Grundstück:{" "}
                <a
                  href={
                    "https://www.geodaten-mv.de/grundsteuerdaten/Karten/Grundvermoegen"
                  }
                  rel="noopener"
                  target="_blank"
                  className="text-blue-800 underline font-bold"
                >
                  Grundsteuerdaten Mecklenburg-Vorpommern
                </a>
              </li>
              <li>
                Sie benötigen darüber hinaus: Grundbuchauszug (optional), ggf.
                Teilungserklärung bei Wohnungseigentum, Bauunterlagen /
                Kauf-/Schenkungsvertrag (optional)
              </li>
            </ul>
          </div>
          <div className={"mb-16"}>
            <p>
              <strong>Nordrhein-Westfalen</strong>
              <br />
              Allgemeine Informationen:{" "}
              <a
                href={"http://www.grundsteuer.nrw.de/"}
                rel="noopener"
                target="_blank"
                className="text-blue-800 underline font-bold"
              >
                Informationen für Grundstücke in Nordrhein-Westfalen
              </a>
              <br />
              Hier finden Sie benötigte Angaben:
            </p>
            <ul className={"list-disc pl-24"}>
              <li>
                Informationsschreiben der Finanzämter inkl. beigefügtes
                Datenstammblatt
              </li>
              <li>
                Angaben zu Ihrem Grundstück:{" "}
                <a
                  href={"https://grundsteuer-geodaten.nrw.de/"}
                  rel="noopener"
                  target="_blank"
                  className="text-blue-800 underline font-bold"
                >
                  Grundsteuerportal (Geodatenportal)
                </a>
              </li>
              <li>
                Sie benötigen darüber hinaus: ggf. Teilungserklärung bei
                Wohnungseigentum oder Kauf-/Schenkungsvertrag
              </li>
            </ul>
          </div>
          <div className={"mb-16"}>
            <p>
              <strong>Rheinland-Pfalz</strong>
              <br />
              Allgemeine Informationen:{" "}
              <a
                href={"https://www.fin-rlp.de/grundsteuer"}
                rel="noopener"
                target="_blank"
                className="text-blue-800 underline font-bold"
              >
                Informationen für Grundstücke in Rheinland-Pfalz
              </a>
              <br />
              Hier finden Sie benötigte Angaben:
            </p>
            <ul className={"list-disc pl-24"}>
              <li>
                Informationsschreiben des Landes inkl. beigefügtes
                Datenstammblatt
              </li>
              <li>
                Angaben zum Bodenrichtwert:{" "}
                <a
                  href={"https://www.boris.rlp.de"}
                  rel="noopener"
                  target="_blank"
                  className="text-blue-800 underline font-bold"
                >
                  Geo Basis Viewer
                </a>
              </li>
              <li>
                Sie benötigen darüber hinaus: Bauunterlagen /
                Kauf-/Schenkungsvertrag (optional)
              </li>
            </ul>
          </div>
          <div className={"mb-16"}>
            <p>
              <strong>Saarland</strong>
              <br />
              Allgemeine Informationen:{" "}
              <a
                href={
                  "https://www.saarland.de/mfe/DE/portale/steuernundfinanzaemter/Grundsteuerreform/Grundsteuerreform.html"
                }
                rel="noopener"
                target="_blank"
                className="text-blue-800 underline font-bold"
              >
                Informationen für Grundstücke in Saarland
              </a>
              <br />
              Hier finden Sie benötigte Angaben:
            </p>
            <ul className={"list-disc pl-24"}>
              <li>
                Informationsschreiben des Landes inkl. beigefügtes
                Datenstammblatt
              </li>
              <li>
                Angaben zu Ihrem Grundstück:{" "}
                <a
                  href={"https://geoportal.saarland.de/Grundsteuer/"}
                  rel="noopener"
                  target="_blank"
                  className="text-blue-800 underline font-bold"
                >
                  Grundsteuerviewer Saarland
                </a>
              </li>
              <li>
                Sie benötigen darüber hinaus: Bauunterlagen /
                Kauf-/Schenkungsvertrag (optional)
              </li>
            </ul>
          </div>
          <div className={"mb-16"}>
            <p>
              <strong>Sachsen</strong>
              <br />
              Allgemeine Informationen:{" "}
              <a
                href={"https://www.grundsteuer.sachsen.de/"}
                rel="noopener"
                target="_blank"
                className="text-blue-800 underline font-bold"
              >
                Informationen für Grundstücke in Sachsen
              </a>
              <br />
              Hier finden Sie benötigte Angaben:
            </p>
            <ul className={"list-disc pl-24"}>
              <li>Informationsschreiben des Landes</li>
              <li>
                Angaben zu Ihrem Grundstück und dem Bodenrichtwert:{" "}
                <a
                  href={
                    "https://www.finanzamt.sachsen.de/grundsteuerportal-sachsen-flurstuecksinformationen-11764.html"
                  }
                  rel="noopener"
                  target="_blank"
                  className="text-blue-800 underline font-bold"
                >
                  Grundsteuerportal Sachsen
                </a>
              </li>
              <li>
                Sie benötigen darüber hinaus: ggf. Grundbuchauszug,
                Bauunterlagen / Kauf-/Schenkungsvertrag
              </li>
            </ul>
          </div>
          <div className={"mb-16"}>
            <p>
              <strong>Sachsen-Anhalt</strong>
              <br />
              Allgemeine Informationen:{" "}
              <a
                href={"https://mf.sachsen-anhalt.de/steuern/grundsteuer/"}
                rel="noopener"
                target="_blank"
                className="text-blue-800 underline font-bold"
              >
                Informationen für Grundstücke in Sachsen-Anhalt
              </a>
              <br />
              Hier finden Sie benötigte Angaben:
            </p>
            <ul className={"list-disc pl-24"}>
              <li>Informationsschreiben des Landes</li>
              <li>
                Angaben zu Ihrem Grundstück:{" "}
                <a
                  href={"https://www.grundsteuerdaten.sachsen-anhalt.de/"}
                  rel="noopener"
                  target="_blank"
                  className="text-blue-800 underline font-bold"
                >
                  Grundsteuer-Viewer Sachsen-Anhalt
                </a>
              </li>
              <li>
                Sie benötigen darüber hinaus: Grundbuchauszug (optional), ggf.
                Teilungserklärung bei Wohnungseigentum (optional), Bauunterlagen
                / Kauf-/Schenkungsvertrag (optional)
              </li>
            </ul>
          </div>
          <div className={"mb-16"}>
            <p>
              <strong>Schleswig-Holstein</strong>
              <br />
              Allgemeine Informationen:{" "}
              <a
                href={"https://www.schleswig-holstein.de/grundsteuer"}
                rel="noopener"
                target="_blank"
                className="text-blue-800 underline font-bold"
              >
                Informationen für Grundstücke in Schleswig-Holstein
              </a>
              <br />
              Hier finden Sie benötigte Angaben:
            </p>
            <ul className={"list-disc pl-24"}>
              <li>Informationsschreiben des Landes</li>
              <li>
                Angaben zu Ihrem Grundstück:{" "}
                <a
                  href={
                    "https://danord.gdi-sh.de/viewer/resources/apps/bodenrichtwertefuergrundsteuerzweckesh/index.html?lang=de#/"
                  }
                  rel="noopener"
                  target="_blank"
                  className="text-blue-800 underline font-bold"
                >
                  Grundsteuerportal Schleswig-Holstein
                </a>
              </li>
              <li>
                Sie benötigen darüber hinaus: Grundbuchauszug (optional), ggf.
                Teilungserklärung bei Wohnungseigentum, Bauunterlagen /
                Kauf-/Schenkungsvertrag (optional)
              </li>
            </ul>
          </div>
          <div>
            <p>
              <strong>Thüringen</strong>
              <br />
              Allgemeine Informationen:{" "}
              <a
                href={"https://grundsteuer.thueringen.de/"}
                rel="noopener"
                target="_blank"
                className="text-blue-800 underline font-bold"
              >
                Informationen für Grundstücke in Thüringen
              </a>
              <br />
              Hier finden Sie benötigte Angaben:
            </p>
            <ul className={"list-disc pl-24"}>
              <li>Informationsschreiben des Landes einschließlich Beiblatt</li>
              <li>
                Angaben zu Ihrem Grundstück:{" "}
                <a
                  href={
                    "https://thueringenviewer.thueringen.de/thviewer/grundsteuer.html"
                  }
                  rel="noopener"
                  target="_blank"
                  className="text-blue-800 underline font-bold"
                >
                  Grundsteuer-Viewer Thüringen (Bereitstellung ab 1. Juli 2022)
                </a>
              </li>
              <li>
                Sie benötigen darüber hinaus: Grundbuchauszug (optional), ggf.
                Teilungserklärung bei Wohnungseigentum (optional) Bauunterlagen
                / Kauf-/Schenkungsvertrag (optional)
              </li>
            </ul>
          </div>
        </>
      ),
    },
    {
      header:
        "Welche Sachverhalte deckt „Grundsteuererklärung für Privateigentum“ ab?",
      id: "sachverhalte",
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
            Überprüfen Sie unter “
            <a href={props.pruefenPath} className="underline text-blue-800">
              Nutzung prüfen
            </a>
            ”, ob unser Online-Dienst für Sie in Frage kommt.
          </p>
        </>
      ),
    },
    {
      header:
        "Welche Sachverhalte deckt „Grundsteuererklärung für Privateigentum“ nicht ab?",
      id: "ausgeschlossene-sachverhalte",
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
              Eigentümer:in des Grundstücks ist eine ungeteilte
              Erbengemeinschaft oder eine Person mit Wohnsitz im Ausland.
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
            . Überprüfen Sie unter “
            <a href={props.pruefenPath} className="underline text-blue-800">
              Nutzung prüfen
            </a>
            ”, ob unser Online-Dienst für Sie in Frage kommt.
          </p>
        </>
      ),
    },
    {
      header:
        "In welchem Bundesland muss ein Grundstück liegen, damit es für „Grundsteuererklärung für Privateigentum“ infrage kommt?",
      id: "bundesmodell",
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
      header: "Bis wann kann ich meine Grundsteuererklärung abgeben?",
      id: "ab-wann-online",
      content: (
        <>
          <p>
            Als Eigentümer:in sind Sie dazu verpflichtet, Ihre
            Grundsteuererklärung bis zum 31. Januar 2023 abgeben. Weitere
            Informationen finden Sie hier:{" "}
            <a
              className={"underline"}
              href={
                "https://grundsteuererklaerung-fuer-privateigentum.zammad.com/help/de-de/28-fragen-zur-abgabefrist-31-januar-2023"
              }
            >
              Abgabefrist
            </a>
          </p>
        </>
      ),
    },
    {
      header:
        "In meinem Informationsschreiben steht, ich soll die Erklärung über ELSTER abgeben. Darf ich „Grundsteuererklärung für Privateigentum“ trotzdem nutzen?",
      id: "elster",
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
      header:
        "Ich habe bereits ein ELSTER-Konto. Kann ich „Grundsteuererklärung für Privateigentum” nutzen?",
      id: "elster-konto-vorhanden",
      content: (
        <p>
          Ja, sie können „Grundsteuererklärung für Privateigentum“ nutzen, wenn
          Sie bereits ein ELSTER-Konto haben.
        </p>
      ),
    },
    {
      header: "Brauche ich ein ELSTER-Konto?",
      id: "elster-konto",
      content: (
        <>
          <p>
            Nein, Sie brauchen kein ELSTER-Konto, um den Online-Dienst
            „Grundsteuererklärung für Privateigentum“ nutzen zu können. Wenn Sie
            kein ELSTER-Konto haben, können Sie sich entweder mit Ihrem
            Personalausweis über die App BundesIdent oder mit einem so genannten
            Freischaltcode identifizieren. Dieser benötigt aktuell einige Zeit,
            um per Post zugestellt zu werden.
          </p>
          <p className="mt-24">
            Wenn Sie bereits ein ELSTER-Konto haben, können Sie den
            Online-Dienst auch nutzen und sich mit Ihrem ELSTER-Zertifikat
            identifizieren.
          </p>
          <p className="mt-24">
            Falls Sie Schwierigkeiten bei den genannten Identifizierungsoptionen
            haben, können Sie auch die Anmeldedaten oder das bereits
            identifizierte Konto Ihrer nahen Angehörigen nutzen.
          </p>
        </>
      ),
    },
    {
      header: "Ist „Grundsteuererklärung für Privateigentum“ kostenlos?",
      id: "kostenlos",
      content: (
        <>
          <p>Ja, unser Online-Dienst ist kostenlos.</p>
        </>
      ),
    },
    {
      header:
        "Kann ich „Grundsteuererklärung für Privateigentum“ nutzen, wenn ich mehrere Grundstücke habe?",
      id: "mehrere-grundstuecke",
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
      id: "digitalservice",
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
      id: "grundsteuerreform",
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
      id: "warum",
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
