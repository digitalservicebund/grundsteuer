import { useTranslation } from "react-i18next";
import { MetaFunction } from "@remix-run/node";
import {
  BmfLogo,
  Button,
  ContentContainer,
  SimplePageLayout,
} from "~/components";
import ArrowBackIcon from "~/components/icons/mui/ArrowBack";
import { pageTitle } from "~/util/pageTitle";

export const meta: MetaFunction = () => {
  return { title: pageTitle("Nutzungsbedingungen") };
};

export default function Nutzungsbedingungen() {
  const { t } = useTranslation("all");
  return (
    <SimplePageLayout>
      <Button
        to="/"
        look="secondary"
        icon={<ArrowBackIcon />}
        className="mb-32"
      >
        {t("termsOfUse.backButton")}
      </Button>

      <div className="mb-32 md:mb-64">
        <BmfLogo />
      </div>

      <h1 className="text-32 leading-40 mb-32 max-w-screen-sm md:text-64 md:leading-68 md:mb-48">
        {t("termsOfUse.headline")}
      </h1>
      <ContentContainer size="md">
        <p className="mb-32">Stand: 15.08.2022</p>
        <h2 className="text-24 mb-24 font-bold">Präambel</h2>
        <p>
          Die Software „Grundsteuererklärung für Privateigentum“ ist eine
          webbasierte Anwendung („Anwendung“), welche die DigitalService GmbH
          des Bundes, Prinzessinenstraße 8-14, 10969 Berlin („wir“, „uns“,
          „unser“), im Auftrag der Bundesrepublik Deutschland, vertreten durch
          das Bundesministerium der Finanzen (BMF), entwickelt hat und betreibt.
        </p>
        <p>
          Die Anwendung unterstützt die Nutzer:innen bei der selbstständigen
          Erstellung und Übermittlung ihrer Erklärung zur Feststellung des
          Grundsteuerwerts (“Grundsteuererklärung”) an die Finanzverwaltung, die
          im Rahmen der Grundsteuerreform im Jahr 2022 zum ersten Mal abgegeben
          wird. Es handelt sich um ein Angebot, welches es zur Abgabe von
          Grundsteuererklärung verpflichteten Eigentümer:innen von privaten
          wirtschaftlichen Einheiten (“Grundstücke”) vereinfachen soll, dieser
          Pflicht nachzukommen. Es wird diesen vollständig kostenlos zur
          Verfügung gestellt. Es handelt sich um einen Service, den wir im
          Auftrag des Bundesministeriums der Finanzen, aber in eigenem Namen
          erbringen. Aus diesen Nutzungsbedingungen berechtigt und verpflichtet
          werden im Verhältnis zu den Nutzer:innen allein wir.
        </p>
        <p className="mb-32">
          Es gelten ausschließlich diese Nutzungsbedingungen. Die Geltung
          entgegenstehender oder abweichender Nutzungs- bzw.
          Geschäftsbedingungen ist ausgeschlossen, auch wenn diesen nicht
          ausdrücklich widersprochen wird.
        </p>

        <h2 className="text-24 mb-24 font-bold">
          § 1 – Unsere Leistungen für Sie / Programmumfang
        </h2>
        <p>
          Das Angebot zur Nutzung der Anwendung richtet sich ausschließlich an
          natürliche Personen, die Eigentümer:innen von wirtschaftlichen
          Einheiten (“Grundstücke”) sind und einfache Sachverhalte haben
          („Nutzer:innen“). Ob Sie zu dieser Gruppe gehören, können Sie mit dem
          Fragenkatalog in der Vorprüfung ermitteln (dazu unten).
        </p>
        <p>
          Den Nutzer:innen ermöglicht unsere Anwendung die Abgabe ihrer
          Grundsteuererklärung, wenn sie in Deutschland einen Wohnsitz haben.
        </p>
        <p className="mb-32">
          Im Folgenden wird der Programmumfang beschrieben (§87c der
          Abgabenordnung).
        </p>

        <h3 className="text-18 mb-8 text-blue-900 font-bold">
          Abgedeckte Sachverhalte
        </h3>
        <p>
          Bitte beachten Sie, dass Sie Ihre Grundsteuererklärung mit diesem
          Service machen können, nur wenn auf Ihr Eigentum Folgendes zutrifft:
        </p>
        <ul className="list-disc ml-24 mb-16">
          <li>
            <strong>Grund der Feststellung</strong>: Es handelt sich bei der
            abzugebenden Grundsteuererklärung um die Hauptfeststellung. Wenn es
            sich um Nachfeststellung, Artfortschreibung oder Wertfortschreibung
            handelt, kann die Grundsteuererklärung mit unserer Anwendung nicht
            abgegeben werden.
          </li>
          <li>
            <strong>Stichtag 01.01.2022</strong>: Die Grundsteuererklärung wird
            auf den 1. Januar 2022 abgegeben. Wenn es sich um einen anderen
            Stichtag handelt, kann die Grundsteuererklärung mit unserer
            Anwendung nicht abgegeben werden.
          </li>
          <li>
            <strong>Eigentumsverhältnisse</strong>: Das zu erklärende Grundstück
            ist ein Alleineigentum einer natürlichen Person, Eigentum von
            Ehegatten / Lebenspartnern, Eigentum einer Bruchteilsgemeinschaft.
            Die Anzahl der Eigentümer:innen ist auf 10 begrenzt. Wenn das zu
            erklärende Grundstück im Allein- oder Miteigentum einer Körperschaft
            der öffentlichen Rechts, einer unternehmerisch tätigen juristischen
            Person, einer nicht unternehmerisch tätigen juristischen Person,
            Erbengemeinschaft, Grundstücksgemeinschaft ausschl. von natürlichen
            Personen, Grundstücksgemeinschaft ausschl. von juristischen Personen
            oder eine andere Grundstücksgemeinschaft ist, kann die
            Grundsteuererklärung mit unserer Anwendung nicht abgegeben werden.
          </li>
          <li>
            <strong>Absender:in der Erklärung</strong>: Die Grundsteuererklärung
            wird von einer Privatperson, die in Deutschland wohnt, abgegeben.
            Personen ausschließlich mit Wohnsitz im Ausland sowie
            Hausverwaltungen, Steuerberater:in, Rechtsanwält:innen
            (Bevollmächtigte im Sinne des § 80 der Abgabenordnung) können die
            Grundsteuererklärung mit unserer Anwendung nicht abgeben.
          </li>
          <li>
            <strong>Bundesland</strong>: Das zu erklärende Grundstück liegt in
            einem Bundesland, das das Bundesmodell umsetzt: Berlin, Brandenburg,
            Bremen, Mecklenburg-Vorpommern, Nordrhein-Westfalen,
            Rheinland-Pfalz, Saarland, Sachsen, Sachsen-Anhalt,
            Schleswig-Holstein, Thüringen. Für Grundstücke in Baden-Württemberg,
            Bayern, Hamburg, Hessen und Niedersachsen kann unsere Anwendung
            nicht verwendet werden.
          </li>
          <li>
            <strong>Art der wirtschaftlichen Einheit</strong>: Das zu erklärende
            Grundstück ist ein Einfamilienhaus, Zweifamilienhaus,
            Wohnungseigentum oder unbebautes Grundstück. Wenn der zu erklärende
            Grundbesitz ein Mietwohngrundstück, ein sog. Nichtwohngrundstück
            (Teileigentum, Geschäftsgrundstück, gemischt genutztes Grundstück
            oder sonstiges Grundstück) oder ein Betrieb der Land- und
            Forstwirtschaft ist, kann die Grundsteuererklärung mit unserer
            Anwendung nicht abgegeben werden.
          </li>
          <li>
            <strong>Miteigentumsanteile</strong>: Eigentumswohnungen haben immer
            Miteigentumsanteile am Grundstück und sind von diesem Service
            abgedeckt. Andere Formen von Miteigentum (Feld “Zur wirschaftlichen
            Einheit gehörender Anteil: Zähler” und “Zur wirschaftlichen Einheit
            gehörender Anteil: Nenner”) wie Eigentumswohnungen mit
            Autostellplätzen, Teile von Privatwegen, Teile von Gärten, Teile von
            Garagenhöfen oder Parkplätzen, Teile von Spielplätzen, Teile von
            Bootsstegen sind von diesem Service nicht abgebildet. Wichtig: Dabei
            geht es nicht um die Anteile einzelner Eigentümer:innen an dem
            Grundvermögen wie beispielsweise 1/2 bei Ehepaaren.
          </li>
          <li>
            <strong>Gebäude auf fremdem Grund und Boden / Erbbaurecht</strong>:
            Wenn für das Grundstück ein Erbbaurecht bestellt wurde, es sich um
            ein Gebäude auf fremdem Grund und Boden oder mit einem Erbbaurecht
            oder einem Gebäude auf fremdem Grund und Boden belasteten Grundstück
            handelt, kann die Grundsteuererklärung mit unserer Anwendung nicht
            abgegeben werden.
          </li>
          <li>
            <strong>Steuerbegünstigungen- oder befreiungen</strong>: Für zu
            erklärende Grundstück sind keine Steuerbegünstigungen- oder
            befreiungen einschlägig. Sind solche einschlägig, kann die
            Grundsteuererklärung mit unserer Anwendung nicht abgegeben werden.
          </li>
          <li>
            <strong>Anzahl der Flurstücke</strong>: Das zu erklärende Grundstück
            besteht aus 20 oder weniger Flurstücken. Wenn das zu erklärende
            Grundstück aus mehr als 20 Flurstücken besteht, kann die
            Grundsteuererklärung mit unserer Anwendung nicht abgegeben werden.
          </li>
        </ul>
        <p className="mb-32">
          Um zu prüfen, ob Sie Ihre Grundsteuererklärung mit
          “Grundsteuererklärung für Privateigentum” machen können, nutzen Sie
          bitte den dafür vorgesehenen Fragebogen unter{" "}
          <a href="/pruefen/start" className="text-blue-800 underline">
            www.grundsteuererklaerung-fuer-privateigentum.de/pruefen/start
          </a>
          .
        </p>

        <h3 className="text-18 mb-8 text-blue-900 font-bold">Prozess</h3>
        <p>Unsere Anwendung besteht aus folgenden vier Schritten:</p>
        <ul className="list-decimal ml-24 mb-32">
          <li>Vorprüfen</li>
          <li>Registrieren und Anmelden</li>
          <li>Identifizieren</li>
          <li>Ausfüllen und Abgeben der Grundsteuererklärung</li>
        </ul>

        <h4 className="text-gray-800 mb-8">
          (1) Vorprüfen: Bin ich zur Nutzung von “Grundsteuererklärung für
          Privateigentum“ berechtigt?
        </h4>
        <p className="mb-16">
          Ob Sie berechtigt sind, mit unserer Anwendung eine
          Grundsteuererklärung abzugeben, können Sie im ersten Schritt über die
          Funktion „Kann ich teilnehmen?“ (
          <a href="/pruefen/start" className="text-blue-800 underline">
            www.grundsteuererklaerung-fuer-privateigentum.de/pruefen/start
          </a>
          ) ermitteln. Dazu haben Sie die dort aufgeführten Fragen zu
          beantworten. Wenn Sie alle Fragen beantwortet haben, teilt Ihnen
          unsere Anwendung mit, ob Sie berechtigt sind, mit
          “Grundsteuererklärung für Privateigentum“ Ihre Grundsteuererklärung
          abzugeben.
        </p>
        <h4 className="text-gray-800 mb-8">(2) Registrieren und Anmelden</h4>
        <p>
          Wenn Sie zur Nutzung berechtigt sind, folgt der zweite Schritt. Dieser
          besteht darin, dass Sie sich registrieren.
        </p>
        <p>
          Zur Registrierung benötigen wir lediglich Email-Adresse. Wenn Sie
          diese Nutzungsbedingungen und die Datenschutzerklärungen gelesen
          haben, müssen Sie dies bestätigen. Mit erfolgter Bestätigung
          verschicken wir an Sie eine Email mit einem für Sie persönlich
          generierten Link (“Magic Link”). Wenn Sie auf diesen Link klicken,
          werden sie auf die Seite von “Grundsteuererklärung für Privateigentum“
          geleitet, die die erfolgreiche Registrierung bestätigt. Die
          rechtsverbindliche Registrierung erfolgt erst mit dem Klick auf den
          Magic Link in der Mail.
        </p>
        <p>
          Jedes Mal, wenn Sie sich anmelden, müssen sie Ihre Email-Adresse
          eingeben und auf den Magic Link in der erhaltenen Email klicken.
        </p>
        <p>Es gibt kein vom Nutzer angelegtes Passwort.</p>
        <p className="mb-16">
          Die Registrierung zum Programm und die Anmeldung steht ausschließlich
          in deutscher Sprache zur Verfügung.
        </p>
        <h4 className="text-gray-800 mb-8">(3) Identifizieren</h4>
        <p className="mb-8">
          Um Ihre Grundsteuererklärung an die Finanzverwaltung abschicken zu
          können, müssen wir Ihre Identität für die Finanzverwaltung feststellen
          (§87d der Abgabenordnung). Ohne Identifizierung ist keine Übermittlung
          der Grundsteuererklärung an die Finanzverwaltung möglich. Die
          Identifizierung ist jederzeit möglich: am Anfang des Prozesses, am
          Ende des Prozesses oder auch zwischendurch.
        </p>
        <p className="mb-16">Es gibt zwei Identifizierungsmöglichkeiten:</p>
        <ul className="list-disc ml-24 mb-8">
          <li>Identifizierung per Brief (Freischaltcode)</li>
        </ul>
        <p className="mb-16">
          Zur Identifizierung mit dem Freischaltcode benötigen wir Ihr
          Geburtsdatum und Ihre Steueridentifikationsnummer. Diese geben Sie in
          den entsprechenden Eingabefeldern ein. Mit erfolgter Bestätigung
          verschicken wir für Sie elektronisch einen Antrag an die
          Finanzverwaltung. Die Finanzverwaltung schickt Ihnen per Brief an Ihre
          Meldeadresse Ihren so genannten Freischaltcode innerhalb von zwei
          Wochen zu. Diesen müssen Sie in unserer Anwendung angeben. Der
          Nutzende gilt nur dann als identifiziert, wenn sie / er den
          Freischaltcode eingegeben hat.
        </p>
        <ul className="list-disc ml-24 mb-8">
          <li>Identifizierung mit dem ELSTER-Konto</li>
        </ul>
        <p className="mb-16">
          Die Identifizierung mit dem ELSTER-Konto wird über die
          EKONA-Schnittstelle (SAML 2.0) realisiert. Der Nutzende landet auf der
          Webseite von ELSTER (
          <a
            href="https://www.elster.de/ekona/login/softpse"
            target="_blank"
            className="underline text-blue-800"
          >
            https://www.elster.de/ekona/login/softpse
          </a>
          ), auf der er sich in sein ELSTER-Konto einloggen kann. Er lädt sein
          ELSTER-Zertifikat hoch und gibt sein entsprechendes ELSTER-Passwort
          ein oder wählt eine andere von ELSTER vorgesehene Login-Möglichkeit
          aus (Sicherheitsstick, Personalausweis, Signaturkarte etc.). Dem
          Nutzenden werden die Daten angezeigt, die der DigitalService bekommt
          (Name, Vorname, Geburtsdatum, Steuer-ID, Anschrift, Geburtsort,
          Geburtsland, akad. Grad). Nach erfolgter Authentifizierung auf der
          Webseite von ELSTER bestätigt der Nutzende die Datenweitergabe an den
          DigitalService. Der DigitalService speichert in den AuditLogs Name,
          Vorname, Steuer-ID und Anschrift. So ist der Nutzende identifiziert
          und er wird zurück auf die Seite “Grundsteuererklärung für
          Privateigentum” weitergeleitet.
        </p>
        <h4 className="text-gray-800 mb-8">
          (4) Ausfüllen und Abgeben der Grundsteuererklärung
        </h4>
        <p>
          Die Anwendung “Grundsteuererklärung für Privateigentum” führt Sie
          schrittweise durch die erforderlichen Angaben zu Ihrem Grundstück, zu
          dem Gebäude auf dem Grundstück (falls vorhanden) und zu den
          Eigentümer:innen.
        </p>
        <p>
          Wenn Sie alle Angaben getätigt haben, führt unsere Anwendung diese
          noch einmal in einer Übersicht für Sie auf. Sie erhalten Gelegenheit,
          sämtliche Angaben noch einmal über die entsprechenden Buttons zu
          überprüfen und bei Bedarf zu korrigieren. Eine Korrektur ist bis zur
          endgültigen Abgabe der Erklärung in jedem Schritt auch über den
          „Zurück“-Button und über die seitliche Navigationsbar möglich.
        </p>
        <p>
          Schließlich bitten wir Sie um Ihre abschließenden Erklärungen und
          erneut um Zustimmung zur Verarbeitung Ihrer Daten zur Übermittlung
          Ihrer Steuererklärung an das Finanzamt. Sie werden ein weiteres Mal
          auf die Datenschutzerklärungen und diese Nutzungsbedingungen
          hingewiesen (im Übrigen können Sie diese jederzeit einsehen).
        </p>
        <p>
          Erst wenn Sie alle Angaben bestätigt und durch die erforderlichen
          Häkchen Ihre Zustimmung erklärt haben, können Sie Ihre
          Grundsteuererklärung über den Button “Grundsteuererklärung abschicken“
          rechtsverbindlich abschicken.
        </p>
        <p>
          Nach erfolgreichem elektronischem Versand können Sie abschließend noch
          einmal alle Ihrer Angaben sowie die Transferticketnummer in Form einer
          PDF-Datei aufrufen und bei sich auf dem Computer abspeichern. Die
          PDF-Datei sieht anders aus als die eben von Ihnen getätigten Angaben.
          Es liegt daran, dass die PDF-Datei direkt von ELSTER-Schnittstelle zur
          Verfügung gestellt wird und die Angaben anders erfasst.
        </p>
        <p className="mb-32">
          Bitte beachten Sie, dass eine dauerhafte Sicherung der Daten bei uns
          nicht erfolgt. Für eine dauerhafte Sicherung der von Ihnen
          eingegebenen Daten, sollten Sie die von uns an den genannten Stellen
          angebotene Downloadfunktion nutzen. Ein Versand per E-Mail erfolgt
          nicht.
        </p>

        <h3 className="text-18 mb-8 text-blue-900 font-bold">
          Zusammenfassung
        </h3>
        <p>
          Zusammenfassend lassen sich unsere Leistungen wie folgt beschreiben:
        </p>
        <ul className="list-disc ml-24 mb-16">
          <li>
            Wir informieren Nutzer:innen über die Grundsteuererklärung, z.B.
            darüber, wer diese Erklärung abgeben muss und welche Fristen dabei
            zu beachten sind. Ergänzend informieren wir auch detailliert
            darüber, wer die Anwendung in Anspruch nehmen kann.
          </li>
          <li>
            Wir registrieren Nutzer:innen / melden Nutzer:innen an, indem sie
            Ihre Email-Adresse hinterlassen. Sobald die Nutzer:innen auf einen
            Magic Link in der erhaltenen Email-Nachricht klicken, sind sie
            registriert / angemeldet.
          </li>
          <li>
            Wir identifizieren Nutzer:innen über eine der zwei möglichen
            Identifikationsoptionen: per Brief (Freischaltcode) oder mit dem
            ELSTER-Zertifikat.
          </li>
          <li>
            Zum Zwecke der Erstellung und Übermittlung ihrer
            Grundsteuererklärung stellen wir den Nutzer:innen eine vereinfachte
            Eingabemaske zur Verfügung, in der sie den Mindestumfang an Daten
            eintragen, der für eine Grundsteuererklärung von Mitgliedern dieser
            Personengruppe verlangt wird. Dies betrifft die Angaben zum
            Grundstück, zum Gebäude auf dem Grundstück (falls vorhanden) und zu
            den Eigentümer:innen.
          </li>
          <li>
            Anschließend stellen wir den Nutzer:innen eine Übersicht über alle
            ihre getätigten Angaben zum Zwecke der Überprüfung zur Verfügung.
            Sodann ermächtigen und beauftragen uns die Nutzer:innen, ihre
            Grundsteuererklärung in ihrem Namen über ELSTER, das digitale Portal
            der deutschen Finanzverwaltung, an das die Anwendung angebunden ist,
            an das jeweils zuständige Finanzamt zu übermitteln. Die Erstellung
            der Grundsteuererklärung erfolgt somit außerhalb der Anwendung,
            jedoch unter Verwendung der durch die Nutzer:innen in der Anwendung
            eingegebenen Daten.
          </li>
          <li>
            Nach erfolgreicher Übermittlung der Daten sendet ELSTER eine
            Bestätigung der getätigten Angaben an uns, die wir den Nutzer:innen
            als PDF-Datei zur Verfügung stellen
          </li>
          <li>
            Die weitere Abwicklung der Grundsteuererklärung erfolgt
            ausschließlich im Verhältnis zwischen Finanzverwaltung und
            Nutzer:in.
          </li>
          <li>
            Eine dauerhafte Speicherung der von den Nutzer:innen eingegebenen
            Steuerangaben erfolgt nicht.
          </li>
          <li>
            Das Nutzer:innenkonto wird nach Abschicken der Grundsteuererklärung
            oder nach Inaktivität automatisch nach 4 Monaten gelöscht.
          </li>
          <li>
            Nach Abschicken der Grundsteuererklärung kann diese nicht mehr über
            unsere Anwendung korrigiert werden. Die Nutzer:innen müssen sich in
            diesem Fall unmittelbar an das Finanzamt wenden. Möglich ist es
            aber, eine neue Grundsteuererklärung über die Anwendung abzugeben.
          </li>
        </ul>
        <p>Im Übrigen gilt:</p>
        <p>
          Keine der von uns erbrachten Leistungen beinhalten oder begründen
          Steuerberatungsleistungen und ersetzen solche auch nicht. Die
          Anwendung ist darauf ausgerichtet, dass sie vollautomatisch und ohne
          menschliche Eingriffe funktioniert, mit der Maßgabe, dass die
          Anwendung den Nutzer:innen die Möglichkeit und Flexibilität bietet,
          Eingabefehler manuell zu korrigieren, bevor die Grundsteuererklärung
          endgültig an die Steuerbehörden übermittelt wird.
        </p>
        <p className="mb-32">
          Unsere Leistungen stellen somit keine genehmigungspflichtigen
          Leistungen nach dem Steuerberatungsgesetz (StBerG) oder
          Rechtsdienstleistungsgesetz (RDG) dar.
        </p>

        <h2 className="text-24 mb-24 font-bold">
          § 2 – Auftragsverhältnis / Zustandekommen
        </h2>
        <p>Sie geben zu zwei Zeitpunkten rechtsverbindliche Erklärungen:</p>
        <p>
          Zum einen, wenn Sie auf der Registrierungsseite unserer Anwendung,
          nach Bestätigung von Datenschutzerklärungen und dieser
          Nutzungsbedingungen, die Registrierung mit dem entsprechenden Button
          bestätigen.
        </p>
        <p>
          Zum anderen schließen wir einen Vertrag, wenn Sie uns mit der
          Übermittlung Ihrer Grundsteuererklärung beauftragen, indem Sie – nach
          erneuter Bestätigung der Datenschutzerklärungen und diese
          Nutzungsbedingungen – den Button zur Absendung der
          Grundsteuererklärung betätigen.
        </p>
        <p>
          In beiden Fällen kommt ein Vertragsverhältnis im Sinne von § 662 BGB
          zwischen Ihnen als Auftrageber:innen und uns als Auftragnehmerin
          zustande, weil wir unsere Leistungen für Sie vollständig kostenlos
          erbringen.
        </p>
        <p className="mb-32">
          Sie schulden uns auch keinen Aufwendungsersatz. §§ 669, 670 BGB finden
          daher keine Anwendung
        </p>

        <h2 className="text-24 mb-24 font-bold">
          § 3 – Urheberrechtsschutz / Lizenzbedingungen
        </h2>
        <p>
          Alle Inhalte (einschließlich Logos, Bilder, Videos, Grafiken und
          Texte), die mit der Anwendung in Verbindung stehen und veröffentlicht
          werden, sind als Marken, jedenfalls aber urheberrechtlich geschützt.
          Sie dürfen Inhalte ohne unsere vorherige schriftliche Zustimmung nicht
          nachahmen, modifizieren, verwenden, reproduzieren, verteilen, ändern
          oder anderweitig nutzen, sei es für private oder kommerzielle Zwecke.
          Die gesetzlichen Bestimmungen bleiben unberührt.
        </p>
        <p>
          Vorbehaltlich der Einhaltung dieser Bedingungen durch Sie gewähren wir
          Ihnen eine begrenzte, nicht ausschließliche, nicht unterlizenzierbare,
          widerrufliche und nicht übertragbare Lizenz zum:
        </p>
        <ul className="list-[lower-roman] ml-24 mb-16">
          <li>
            Zugriff auf die Anwendung über das Internet allein zur Nutzung der
            Dienste und
          </li>
          <li>
            auf alle Inhalte, Informationen und damit zusammenhängenden
            Materialien, die wir Ihnen zur Verfügung stellen, und dazu, diese zu
            nutzen und zwar in jedem Fall ausschließlich für den persönlichen
            und nicht gewerblichen Gebrauch.
          </li>
        </ul>
        <p className="mb-32">
          Diese Lizenzgewährung gilt auch für alle Updates, Upgrades und neuen
          Versionen der Anwendung. Wir behalten uns das Recht vor, alle
          Informationen in der Anwendung zu ändern, einschließlich, aber nicht
          beschränkt auf, das Überarbeiten und/oder Löschen von Funktionen oder
          anderen Informationen ohne vorherige Ankündigung. Alle Rechte, Titel
          und Interessen, die hier nicht ausdrücklich gewährt werden, sind uns
          und unseren Lizenzgebern vorbehalten.
        </p>

        <h2 className="text-24 mb-24 font-bold">§ 4 – Datenschutz</h2>
        <p className="mb-32">
          Unsere Datenschutzerklärung können Sie{" "}
          <a href="/datenschutz" className="underline text-blue-800">
            hier
          </a>{" "}
          einsehen.
        </p>

        <h2 className="text-24 mb-24 font-bold">
          § 5 – Pflichten der Nutzer:innen
        </h2>
        <p>
          Damit die Daten im Zusammenhang mit Ihrer Grundsteuererklärung korrekt
          bearbeitet werden können, ist es in Ihrem Interesse, aber auch Ihre
          Pflicht, die Daten korrekt auszufüllen. Damit können wir die Erfüllung
          unserer vertraglichen Verpflichtung sicherstellen und Sie im
          Zusammenhang mit der Grundsteuererklärung unterstützen.
        </p>
        <p>
          Sie erklären sich damit einverstanden, keinen Computercode, keine
          Data-Mining-Software, Roboter, Bots, Skripte, Scraper oder andere
          ähnliche automatisierte oder manuelle Verfahren zu verwenden, um
          Zugang zu den Webseiten, Daten oder Inhalten (einschließlich
          Benutzerinhalten) oder anderen Diensten zu erhalten, die im
          Zusammenhang mit der Anwendung stehen oder über sie aufgerufen werden
          können. Sie erklären sich damit einverstanden, solche Prozesse nicht
          zum Testen oder Überwachen der Schwachstelle der Dienste oder für
          andere Zwecke einzusetzen. Sie stimmen ferner zu, keine
          Authentifizierungsmechanismen oder andere Anwendungen zu verletzen,
          die für die Funktionalität der Anwendung erforderlich sind. Sie dürfen
          keine Viren, Spyware oder andere bösartige Codes, Software oder
          Mechanismen einsetzen, die die Funktionalität der Anwendung
          beeinträchtigen könnten.
        </p>
        <p>
          Sie stimmen zu, unsere Corporate Identity nicht zu manipulieren oder
          zu nutzen, sei es durch Logos, Header, E-Mails oder anderweitig, um
          die Herkunft oder den Inhalt von Nachrichten, die im Zusammenhang mit
          den Diensten gesendet werden, zu verbergen oder in irgendeiner Weise
          zu ändern.
        </p>
        <p>
          Sie stimmen zu, keine Gesetze, Statuten, Verordnungen oder
          Vorschriften im Zusammenhang mit der Nutzung der Anwendung und unserer
          Dienste zu verletzen.
        </p>
        <p>
          Sie stimmen zu, bei jeder erforderlichen Maßnahme zur
          Authentifizierung mitzuwirken und Ihre Identität oder alle
          Informationen, die Sie uns zur Verfügung stellen, zu bestätigen.
        </p>
        <p className="mb-32">
          Sie verpflichten sich, Handlungen zu unterlassen, die unsere
          Mitarbeiter:innen, Beauftragte und Vertreter:innen diffamieren,
          bedrohen oder belästigen.
        </p>

        <h2 className="text-24 mb-24 font-bold">
          § 6 – Haftung und Gewährleistung
        </h2>
        <p>
          Unsere Haftung und die persönliche Haftung unserer Mitarbeiter:innen,
          Stellvertreter:innen, Organe und Erfüllungsgehilfen sind
          ausgeschlossen, es sei denn, es liegen eine oder mehrere der folgenden
          Fallkonstellationen vor:
        </p>
        <ul className="list-[lower-roman] ml-24 mb-32">
          <li>Vorsatz oder grobe Fahrlässigkeit,</li>
          <li>die Verletzung von Leben, Leib oder Gesundheit,</li>
          <li>
            Haftung nach den Vorschriften des Produkthaftungsgesetzes sowie
          </li>
          <li>von uns übernommene Garantie.</li>
        </ul>

        <h2 className="text-24 mb-24 font-bold">
          § 7 – Jederzeitiges Widerrufsrecht
        </h2>
        <p className="mb-32">
          Sie können diesen Vertrag bis zum Versand Ihrer Grundsteuererklärung
          jederzeit widerrufen. Schreiben Sie uns eine Email-Nachricht unter{" "}
          <a
            href="mailto:hilfe@grundsteuererklaerung-fuer-privateigentum.de"
            className="underline text-blue-800"
          >
            hilfe@grundsteuererklaerung-fuer-privateigentum.de
          </a>{" "}
          mit dem Betreff “Widerruf”. Ihr Nutzer:innenkonto und sämtliche Ihrer
          Eingaben werden in diesem Fall sofort gelöscht.
        </p>

        <h2 className="text-24 mb-24 font-bold">
          § 8 – Laufzeit und Beendigung
        </h2>
        <p>
          Der zwischen Ihnen und uns abgeschlossene Vertrag endet automatisch,
          wenn wir die geschuldete Leistung vollständig erbracht haben.
        </p>
        <p>
          Wir sind zur Kündigung berechtigt, wenn wir unser
          vertragsgegenständliches Leistungsangebot endgültig einstellen
          (insbesondere, weil das zugrundeliegende Vertragsverhältnis mit dem
          BMF endet). Es gilt § 671 Abs. 2 BGB.
        </p>
        <p className="mb-32">
          Im Übrigen sind wir zur Kündigung nur aus wichtigem Grund berechtigt.
          Ein wichtiger Grund liegt insbesondere dann vor, wenn Sie vorsätzlich
          oder fahrlässig und trotz Abmahnung wiederholt gegen wesentliche
          vertraglichen Pflichten, insbesondere Ihre Pflichten aus § 5 verstoßen
          haben.
        </p>

        <h2 className="text-24 mb-24 font-bold">§ 9 – Schlussbestimmungen</h2>
        <p>
          Wir können diese Bedingungen, alle Bestimmungen oder ergänzenden
          Bedingungen in Bezug auf die Anwendung von Zeit zu Zeit ändern. Solche
          geänderten Regelungen gelten dann für jeden neu abgeschlossenen
          Vertrag.
        </p>
        <p>
          Soweit wir einige oder alle Regelungen für einen laufenden Vertrag mit
          Wirkung für die Zukunft ändern wollen, gilt Folgendes:
        </p>
        <ul className="list-disc ml-24 mb-16">
          <li>
            Im Falle einer nicht nur unwesentlichen Änderung dieser Bedingungen,
            Bestimmungen oder ergänzenden Bedingungen, die Ihre Rechte aus
            diesen Bedingungen nicht nur unwesentlich beeinträchtigt, werden wir
            Sie mindestens 30 Tage vor dem Inkrafttreten der Änderungen
            benachrichtigen. Widersprechen Sie innerhalb dieser Frist nicht,
            oder setzen Sie nach Ablauf der jeweiligen Benachrichtigungsfrist
            den Zugriff auf die Dienste bzw. deren Nutzung fort, gilt Ihre
            Zustimmung, an die Regelungen in der geänderten Fassung gebunden zu
            sein, als erteilt. In unserer Mitteilung an Sie werden wir Sie über
            Ihr Kündigungs-/Widerrufsrecht, die Frist und die Folgen Ihres
            Schweigens informieren.
          </li>
          <li>
            Dies gilt nicht für Änderungen des Vertragsgegenstandes oder für
            eine Änderung wesentlicher Vertragspflichten, die zu einer Änderung
            des Vertragsgefüges insgesamt führen würden. In diesem Fall können
            wir Ihnen anbieten, unseren Vertrag mit Ihnen zu den dann geänderten
            Regelungen fortzusetzen.
          </li>
          <li>
            Überdies behalten wir uns vor, diese Regelungen mit Wirkung für die
            Zukunft anzupassen oder zu ändern, soweit
            <ul className="list-[lower-roman] ml-24">
              <li>
                die Änderungen oder Anpassungen lediglich vorteilhaft für die
                Nutzer:innen sind, oder
              </li>
              <li>
                die Änderungen oder Anpassungen erforderlich sind, um eine
                Übereinstimmung mit geltendem Recht herzustellen, vor allem
                auch, wenn sich die geltende Rechtslage ändert, oder um einem
                Gerichtsurteil oder einer Behördenentscheidung nachzukommen;
              </li>
              <li>
                wenn die Änderungen oder Anpassungen ohne wesentlichen Einfluss
                auf Funktionen der Dienste oder rein technischer oder
                organisatorischer Art sind, oder
              </li>
              <li>
                wir neue Dienste oder Leistungen einführen, die einer
                Beschreibung in den Regelungen bedürfen, es sei denn, dass dies
                für das laufende Vertragsverhältnis nachteilig wäre (in
                letzterem Fall gilt der vorangehende Absatz zu Änderungen des
                Vertragsgegenstandes bzw. wesentlicher Vertragspflichten).
              </li>
            </ul>
          </li>
        </ul>
        <p>
          Es gilt ausschließlich das Recht der Bundesrepublik Deutschland. Ist
          die Nutzer:in eine Verbraucher:in innerhalb der Europäischen Union und
          hat ihren gewöhnlichen Aufenthalt in einem anderen Land, so hindert
          diese Klausel nach Art. 6 Abs. 2 der Verordnung (EG) Nr. 593/2008 (Rom
          I-VO) nicht die Anwendung jener zwingenden Bestimmungen des Rechts am
          Ort ihres gewöhnlichen Aufenthalts, das ohne diese Klausel anzuwenden
          wäre.
        </p>
        <p className="mb-80">
          Sollten einzelne Klauseln dieser Bedingungen ganz oder teilweise
          unwirksam sein oder werden, so bleiben diese Bedingungen im Übrigen
          wirksam. Im Falle einer solchen Unwirksamkeit wird die unwirksame
          Regelung durch die gesetzliche Bestimmung ersetzt.
        </p>
      </ContentContainer>
    </SimplePageLayout>
  );
}
