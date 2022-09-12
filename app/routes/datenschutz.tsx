import { useTranslation } from "react-i18next";
import { MetaFunction } from "@remix-run/node";
import { BmfLogo, Button, SimplePageLayout } from "~/components";
import ArrowBackIcon from "~/components/icons/mui/ArrowBack";
import { pageTitle } from "~/util/pageTitle";

export const meta: MetaFunction = () => {
  return { title: pageTitle("Datenschutzerklärung") };
};

export default function Datenschutz() {
  const { t } = useTranslation("all");
  return (
    <SimplePageLayout>
      <Button
        to="/"
        look="secondary"
        icon={<ArrowBackIcon />}
        className="mb-32"
      >
        {t("dataProtection.backButton")}
      </Button>

      <div className="mb-32 md:mb-64">
        <BmfLogo />
      </div>

      <h1 className="text-32 leading-40 mb-32 max-w-screen-sm md:text-64 md:leading-68 md:mb-48">
        {t("dataProtection.headline")}
      </h1>

      <div className="prose prose-xl mb-64">
        <p>Zuletzt aktualisiert: 04.07.2022</p>
        <p>
          Mit dem Online-Dienst <i>Grundsteuererklärung für Privateigentum</i>{" "}
          möchten wir es Ihnen als Eigentümer:in einfacher machen, Ihre
          Feststellungserklärung online abzugeben.
        </p>
        <p>
          Im Folgenden informieren wir Sie darüber, welche personenbezogenen
          Daten wir erheben, bei wem wir sie erheben und was wir mit diesen
          Daten machen. Außerdem informieren wir Sie über Ihre Rechte in
          Datenschutzfragen und an wen Sie sich diesbezüglich wenden können.
        </p>

        <h2>Wer sind wir?</h2>
        <p>
          Der Online-Dienst <i>Grundsteuererklärung für Privateigentum</i> wird
          im Auftrag des Bundesministeriums für Finanzen von DigitalService GmbH
          des Bundes entwickelt und betrieben.
        </p>
        <p>
          DigitalService ist eine Bundes GmbH. Die Bundesrepublik Deutschland –
          vertreten durch das Bundeskanzleramt – hält 100 Prozent der Anteile
          der GmbH. Unser Ziel: Dienstleistungen, die besser für alle
          funktionieren. Dienstleistungen der Verwaltung sollten für alle
          Menschen genauso einfach zu erreichen und bedienen sein wie andere
          digitale Produkte, die wir in Beruf und Alltag regelmäßig nutzen.
          Deshalb stehen die Nutzer:innen mit ihren Bedürfnissen bei unserer
          Produktentwicklung konsequent im Mittelpunkt. Wir bringen Teams mit
          Kompetenzen in Softwareentwicklung, Design und Produktmanagement mit
          der Verwaltung zusammen. Gemeinsam mit den Verantwortlichen der
          Verwaltung und unter Einbindung von Bürger:innen bauen wir digitale
          Lösungen, die nutzerzentriert, modern und vertrauensfördernd sind.
        </p>
        <p>
          <a
            href="https://digitalservice.bund.de"
            target="_blank"
            className="underline text-blue-800"
          >
            www.digitalservice.bund.de
          </a>
        </p>

        <h2>Wer sind Ihre Ansprechpartner:innen?</h2>
        <p>
          Fragen in datenschutzrechtlichen Angelegenheiten können Sie an die für
          „Grundsteuererklärung für Privateigentum“ zuständigen
          Datenschutzbeauftragten richten:
        </p>

        <h3>Verantwortliche Organisation</h3>
        <p>
          Die datenschutzrechtlich Verantwortliche für die auf unserer Website
          stattfindenden Datenverarbeitungen ist die
        </p>
        <p>
          DigitalService GmbH des Bundes
          <br /> Prinzessinnenstraße 8-14 <br />
          10969 Berlin
          <br />
          Handelsregister: HRB 212879 B<br /> Registergericht: Charlottenburg
        </p>
        <p>
          Vertreten durch:
          <br /> Frau Christina Lang <br />
          E-Mail: datenschutz@digitalservice.bund.de
        </p>

        <h2>Zu welchem Zweck verarbeiten wir Ihre personenbezogenen Daten?</h2>
        <p>
          Zweck des Online-Dienstes ist es, bestimmten Privateigentümer:innen zu
          ermöglichen, auf eine für Sie bequeme und nachvollziehbare Art und
          Weise Ihrer Pflicht zur Abgabe einer Grundsteuererklärung
          nachzukommen.
        </p>
        <p>
          Um den Zweck des Dienstes zu erfüllen, ist die Verarbeitung
          personenbezogener Daten, die für die Feststellung des Grundsteuerwerts
          relevant sind, notwendig.
        </p>

        <h2>Welche personenbezogenen Daten verarbeiten wir?</h2>
        <p>
          Wenn Sie diese Website aufrufen, verarbeiten wir die Daten Ihrer
          Anfrage, wie die konkret aufgerufene Seite, Ihre IP-Adresse, Ihren
          Browser und ähnliche Metadaten kurzfristig auf unserem Server um die
          Website korrekt auszuliefern. Wir speichern diese Daten in Logdateien
          nur in anonymisierter Form, d.h. wir loggen insbesondere keine
          IP-Adressen oder andere Daten, die auf Sie als Person zurückgeführt
          werden könnten.
        </p>
        <p>
          Um Sie zu registrieren und anzumelden, nutzen wir Ihre Email-Adresse.
        </p>
        <p>Für die Identifizierung bieten wir zwei Optionen an:</p>
        <ul>
          <li>Identifizierung mit Freischaltcode</li>
        </ul>
        <p>
          Durch die Eingabe Ihrer steuerlichen Identifikationsnummer und Ihres
          Geburtsdatums erhalten Sie postalisch einen Freischaltcode, den Sie
          für die Identifizierung verwenden.
        </p>
        <ul>
          <li>Identifizierung mit ELSTER-Konto</li>
        </ul>
        <p>
          Die Identifizierung mit Hilfe Ihres ELSTER-Kontos wird über eine
          technische Schnittstelle (EKONA) realisiert. Sie werden direkt auf die
          Webseite von ELSTER (
          <a
            href="https://www.elster.de/ekona/login/softpse"
            target="_blank"
            className="underline text-blue-800"
          >
            https://www.elster.de/ekona/login/softpse
          </a>
          ) weitergeleitet, auf der Sie sich mit Ihrem ELSTER-Konto einloggen
          können. Sie können dort direkt mittels Ihres ELSTER-Zertifikat und
          Passwort bzw. über die von ELSTER vorgesehene Login-Möglichkeit
          (Sicherheitsstick, Personalausweis, Signaturkarte etc.) sich
          authentifizieren. Nach erfolgter Authentifizierung erhält
          DigitalService Name, Vorname, Geburtsdatum, Steuer-ID, Anschrift,
          Geburtsort, Geburtsland, akad. Grad) für den weiteren
          Registrierungsprozess auf dieser Webseite. Der DigitalService
          speichert in den AuditLogs Name, Vorname, Steuer-ID und Anschrift.
        </p>
        <p>
          Sollten Sie eine Grundsteuererklärung über den Steuerlotsen
          abschicken, speichern wir kurzzeitig (60 Minuten) auch eine
          Zusammenfassung Ihrer Angaben, insbesondere Daten über Ihr Grundstück
          und Gebäude und die Kontaktdaten sowie steuerliche
          Identifikationsnummer von Eigentümer:innen. Diese Zusammenfassung
          wird, nachdem wir Sie Ihnen für Ihre Unterlagen in der pdf-Datei
          bereitstellen, zeitnah wieder gelöscht. Die betroffenen Daten sind für
          die Abgabe einer Grundsteuererklärung zwingend notwendig.
        </p>
        <p>
          Nehmen Sie unter der auf unserer Website angegebenen E-Mail-Adresse
          Kontakt zu uns auf, teilen Sie uns zumindest Ihre E-Mail-Adresse mit,
          sowie gegebenenfalls weitere Informationen, die Sie in Ihrer E-Mail
          preisgeben. Damit wir Ihr Anliegen bearbeiten können, müssen wir diese
          Daten verarbeiten.
        </p>
        <p>
          Das gilt ebenso für die Nutzung unserer Help Desk Software{" "}
          <a
            href="https://zammad.de"
            target="_blank"
            className="text-blue-800 underline break-words"
          >
            {" "}
            www.zammad.de
          </a>
          . Das Helpdesk-System ermöglicht es, Supportanfragen zu sortieren und
          zu strukturieren, sowie nach Kategorien zu ordnen, um sie so schneller
          den zuständigen Personen zuzuordnen und immer den Status des Tickets
          im Auge behalten zu können. Sobald Sie uns eine Nachricht schicken,
          wird im Helpdesk-System ein Kundenprofil mit Vorname, Nachname und
          E-Mail-Adresse angelegt. Die Verarbeitung der Daten erfolgt über{" "}
          <a
            href="https://zammad.de"
            target="_blank"
            className="text-blue-800 underline break-words"
          >
            zammad.de
          </a>{" "}
          mit dem ein gültiger Auftragsverarbeitungsvertrag besteht und der
          seinen Sitz in Deutschland hat.
        </p>

        <h2> Auf welcher Grundlage werden die Daten verarbeitet?</h2>
        <p>
          Grundlage für die Datenverarbeitung bei der Registrierung und
          Identifizierung sowie die Übermittlung der Steuerdaten ist Art. 6 Abs.
          1 lit. a der Datenschutzgrundverordnung. Für eine notwendige
          Archivierung der personenbezogenen Daten ist die Rechtsgrundlage Art.
          6 Abs. 1 lit. a und c der Datenschutzgrundverordnung.
        </p>

        <h2>
          Unter welchen Voraussetzungen dürfen wir Ihre Daten an Dritte
          weitergeben?
        </h2>
        <p>
          Ihre in der Grundsteuererklärung eingegebenen Daten übermitteln wir
          mittels ELSTER an die Finanzverwaltung. Diese Übermittlung ist
          zwingend für die Abgabe der Grundsteuererklärung notwendig und
          gesetzlich geregelt. Für die auf diese Weise übermittelten Daten
          gelten die Unterlage Allgemeine Informationen zur Umsetzung der
          datenschutzrechtlichen Vorgaben der Artikel 12 bis 14 der
          Datenschutz-Grundverordnung in der Steuerverwaltung welche Sie unter
          folgendem Link abrufen können:
        </p>
        <p>
          <a
            href="https://www.bzst.de/SharedDocs/Downloads/DE/Informationen_zum_Datenschutz/allg_informationen_zum_Datenschutz.pdf?__blob=publicationFile&v=3"
            target="_blank"
            className="underline text-blue-800"
          >
            Allgemeine Informationen zur Umsetzung der datenschutzrechtlichen
            Vorgaben der Datenschutz-Grundverordnung in der Steuerverwaltung
          </a>
        </p>

        <h2>Wie lange und wo speichern wir Ihre Daten?</h2>
        <p>
          Personenbezogene Daten, die Sie im Rahmen der Steuererklärung angeben,
          werden für die Dauer der aktiven Nutzung verschlüsselt gespeichert.
        </p>
        <p>
          Nach dem Verschicken der Steuererklärung werden die personenbezogenen
          Daten 60 Minuten lang bei uns gespeichert, um Ihnen eine
          Zusammenfassung der übermittelten Daten bereitzustellen. Da danach der
          Zweck der Verarbeitung dieser Daten erfüllt ist, löschen wir sie gemäß
          Art. 5 der Datenschutz-Grundverordnung (DSGVO).
        </p>
        <p>
          Daten, die wir im Rahmen der Identifizierung erheben, sind wir, gemäß
          §87d Abs. 2, verpflichtet 5 Jahre lang aufzubewahren. Diese
          Protokolldaten werden nur zu diesem Zweck und in einem gesonderten
          System gespeichert.
        </p>
        <p>
          Für den Betrieb unseres Dienstes nutzen wir als Auftragsverarbeiter
          den Dienstleister T-Systems International GmbH, Hahnstraße 43d, 60528
          Frankfurt am Main. Ihre Daten werden ausschließlich in einem sicheren
          Rechenzentrum in Deutschland gespeichert.
        </p>
        <p>
          Ihre E-Mails und Kontaktaufnahmen speichern wir so lange, wie es zur
          Bearbeitung Ihrer Anfrage erforderlich ist und speichern Sie
          anschließend maximal für den Zeitraum von 12 Monaten, falls Sie sich
          bezugnehmend auf Ihre ursprüngliche Frage noch einmal an uns wenden.
        </p>

        <h2>Werden Webanalyse-Dienste oder Cookies eingesetzt?</h2>
        <p>
          Für den Betrieb unseres Dienstes setzen wir ausschließlich einen für
          die Funktion der Webseite notwendigen Cookie. Dieser wird
          verschlüsselt auf Ihrem Gerät hinterlegt. Es werden zwei Cookies
          geschrieben:
        </p>
        <ul>
          <li>
            Session-Cookie: Die maximale Länge einer Session entspricht der vom
            Browser festgelegten Session-Länge.
          </li>
          <li>
            Cookie mit Formulardaten: Dieser wird für 3 Monate in Ihrem Browser
            gespeichert.
          </li>
        </ul>
        <p>
          Um den Dienst weiterzuentwickeln und zu analysieren, nutzen wir den
          Open Source Webanalysedienst plausible.io. Dieser erhebt jedoch weder
          personenbezogenen Daten, noch kommen dabei Cookies zum Einsatz.
          Weitere Informationen zu Plausible und der Datenverarbeitung finden
          Sie unter{" "}
          <a
            href="https://plausible.io/data-policy"
            target="_blank"
            className="underline text-blue-800"
          >
            https://plausible.io/data-policy
          </a>
          .
        </p>

        <h2>Unter welchen Voraussetzungen erfolgt der E-Mail-Versand?</h2>
        <p>
          Der Versand der Transaktions-E-Mails ist für die Registrierung sowie
          Anmeldung notwendig. Per E-Mail wird ein eindeutiger Link verschickt
          (“Magic Link”), der Registrierung oder Anmeldung ermöglicht. Die Daten
          werden ausschließlich für die Registrierung und/oder Anmeldung
          verwendet.
        </p>
        <p>
          Rechtsgrundlage für die Verarbeitung Ihrer personenbezogenen Daten ist
          Art. 6 Abs. 1 DSGVO.
        </p>
        <p>
          Die Verwaltung des E-Mail-Versands wird mit dem Dienstleister
          Sendinblue GmbH durchgeführt. Die erhobenen E-Mail-Adressen werden auf
          einem Server der Sendinblue GmbH gespeichert. Eine darüber
          hinausgehende Weitergabe an Dritte findet nicht statt.
        </p>

        <h2>
          Welche Rechte (Auskunftsrecht, Widerspruchsrecht usw.) haben Sie?
        </h2>
        <p>
          Sie haben nach der Datenschutz-Grundverordnung verschiedene Rechte.
          Einzelheiten ergeben sich insbesondere aus Artikel 15 bis 18 und 21
          der Datenschutz-Grundverordnung.
        </p>

        <h3>Recht auf Auskunft</h3>
        <p>
          Sie können Auskunft über Ihre von uns verarbeiteten personenbezogenen
          Daten verlangen. In Ihrem Auskunftsantrag sollten Sie Ihr Anliegen
          präzisieren, um uns das Zusammenstellen der erforderlichen Daten zu
          erleichtern. Daher sollten in dem Antrag möglichst Angaben zum
          konkreten Prozessschritt gemacht werden.
        </p>

        <h3>Recht auf Berichtigung</h3>
        <p>
          Sollten die Sie betreffenden Angaben nicht (mehr) zutreffend sein,
          können Sie eine Berichtigung verlangen. Sollten Ihre Daten
          unvollständig sein, können Sie eine Vervollständigung verlangen.
        </p>

        <h3>Recht auf Löschung</h3>
        <p>
          Sie können die Löschung Ihrer personenbezogenen Daten verlangen. Ihr
          Anspruch auf Löschung hängt u. a. davon ab, ob die Sie betreffenden
          Daten von uns zur Erfüllung unserer gesetzlichen Aufgaben noch
          benötigt werden.
        </p>

        <h3>Recht auf Einschränkung der Verarbeitung</h3>
        <p>
          Sie haben das Recht, eine Einschränkung der Verarbeitung der Sie
          betreffenden Daten zu verlangen.
        </p>

        <h3>Recht auf Widerspruch</h3>
        <p>
          Sie haben das Recht, aus Gründen, die sich aus Ihrer besonderen
          Situation ergeben, jederzeit der Verarbeitung der Sie betreffenden
          Daten zu widersprechen.
        </p>

        <h3>Recht auf Beschwerde </h3>
        <p>
          Wenn Sie der Auffassung sind, dass wir Ihrem Anliegen nicht oder nicht
          in vollem Umfang nachgekommen sind, können Sie bei unserem
          Datenschutzbeauftragten sowie dem Bundesbeauftragten für Datenschutz
          und Informationssicherheit Beschwerde einlegen.
        </p>

        <p>
          Externer Datenschutzbeauftragter der DigitalService GmbH des Bundes
          <br />
          1000 Elephants GmbH <br />
          Björn Stecher <br />
          <a
            href="mailto:datenschutz@digitalservice.bund.de"
            className="underline text-blue-800"
          >
            datenschutz@digitalservice.bund.de
          </a>
        </p>

        <p>
          Bundesbeauftragter für Datenschutz und Informationsfreiheit
          <br />
          Graurheindorfer Str. 153 - 53117 Bonn
          <br />
          Telefon: +49 (0)228-997799-0
          <br />
          Fax: +49 (0)228-997799-5550
          <br />
          E-Mail: poststelle@bfdi.bund.de
          <br />
          De-Mail: poststelle@bfdi.de-mail.de
          <br />
          Online-Beschwerde:{" "}
          <a
            href="https://www.bfdi.bund.de/DE/Service/Beschwerden/beschwerden_node.htm"
            target="_blank"
            className="text-blue-800 underline break-words"
          >
            www.bfdi.bund.de/DE/Service/Beschwerden/beschwerden_node.htm
          </a>
        </p>
      </div>
    </SimplePageLayout>
  );
}
