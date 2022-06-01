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
        <p>Zuletzt aktualisiert: 16.03.2022</p>
        <p>
          Mit dem Online-Dienst Grundsteuererklärung für Privateigentum möchten
          wir es Ihnen als Eigentümer:in einfacher machen, Ihre
          Feststellungserklärung online abzugeben. Die aktuell verfügbare
          Landung Page bildet noch keinen vollständigen Service ab, sondern
          informiert nur über den Service, der Anfang Juli 2022 online geht.
        </p>
        <p>
          Im Folgenden informieren wir Sie darüber, welche personenbezogenen
          Daten wir erheben, bei wem wir sie erheben und was wir mit diesen
          Daten machen. Außerdem informieren wir Sie über Ihre Rechte in
          Datenschutzfragen und an wen Sie sich diesbezüglich wenden können.
        </p>
        <h3>Wer sind wir?</h3>
        <p>
          Der Online-Dienst Grundsteuererklärung für Privateigentum wird im
          Auftrag des Bundesministeriums für Finanzen von DigitalService GmbH
          des Bundes entwickelt und betrieben.
        </p>
        <p>
          DigitalService ist eine GmbH des Bundes. Die Bundesrepublik
          Deutschland – vertreten durch das Bundeskanzleramt – hält 100 Prozent
          der Anteile der GmbH. Unser Ziel: Dienstleistungen, die besser für
          alle funktionieren. Dienstleistungen der Verwaltung sollten für alle
          Menschen genauso einfach zu erreichen und bedienen sein wie andere
          digitale Produkte, die wir in Beruf und Alltag regelmäßig nutzen.
          Deshalb stehen die Nutzer:innen mit ihren Bedürfnissen bei unserer
          Produktentwicklung konsequent im Mittelpunkt. Wir bringen Teams mit
          Kompetenzen in Softwareentwicklung, Design und Produktmanagement mit
          der Verwaltung zusammen. Gemeinsam mit den Verantwortlichen der
          Verwaltung und unter Einbindung von Bürger:innen bauen wir digitale
          Lösungen, die nutzerzentriert, modern und vertrauensfördernd sind.
        </p>
        <p>www.digitalservice.bund.de</p>
        <h3>Wer sind Ihre Ansprechpartner:innen?</h3>
        <p>
          Fragen in datenschutzrechtlichen Angelegenheiten können Sie an die für
          den Steuerlotsen zuständigen Datenschutzbeauftragten richten:
        </p>
        <h4>Verantwortliche Organisation</h4>
        <p>
          Die datenschutzrechtlich Verantwortliche für die auf unserer Website
          stattfindenden Datenverarbeitungen ist die
        </p>

        <p>
          DigitalService GmbH des Bundes
          <br /> Prinzessinenstraße 8-14 <br />
          10969 Berlin
          <br />
          Handelsregister: HRB 212879 B<br /> Registergericht: Charlottenburg
        </p>
        <p>
          Vertreten durch:
          <br /> Frau Christina Lang <br />
          E-Mail: datenschutz@digitalservice.bund.de
        </p>

        <h3>Zu welchem Zweck verarbeiten wir Ihre personenbezogenen Daten?</h3>

        <p>
          Zweck der Landing Page ist es, über das künftige Online-Service zu
          informieren und Nutzer:innen die Möglichkeiten für die Kommunikation
          via E-Mail einzuräumen.
        </p>

        <h3>Welche personenbezogenen Daten verarbeiten wir?</h3>

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
          Nehmen Sie unter der auf unserer Website angegebenen E-Mail-Adresse
          Kontakt zu uns auf, teilen Sie uns zumindest Ihre E-Mail-Adresse mit,
          sowie gegebenenfalls weitere Informationen, die Sie in Ihrer E-Mail
          preisgeben. Damit wir Ihr Anliegen bearbeiten können, müssen wir diese
          Daten verarbeiten.
        </p>
        <h3> Auf welcher Grundlage werden die Daten verarbeitet?</h3>
        <p>
          Für eine notwendige Archivierung der personenbezogenen Daten ist die
          Rechtsgrundlage Art. 6 Abs. 1 lit. a und c der
          Datenschutzgrundverordnung.
        </p>

        <h3>Wie lange und wo speichern wir Ihre Daten?</h3>

        <p>
          Ihre E-Mails und Kontaktaufnahmen speichern wir so lange, wie es zur
          Bearbeitung Ihrer Anfrage erforderlich ist und speichern Sie
          anschließend maximal für den Zeitraum von 12 Monaten, falls Sie sich
          bezugnehmend auf Ihre ursprüngliche Frage noch einmal an uns wenden.
        </p>

        <p>
          Für den Betrieb unseres Dienstes nutzen wir als Auftragsverarbeiter
          den Dienstleister T-Systems International GmbH, Hahnstraße 43d, 60528
          Frankfurt am Main.
        </p>

        <h3>Werden Webanalyse-Dienste oder Cookies eingesetzt?</h3>

        <p>
          Für den Betrieb unseres Dienstes setzen wir ausschließlich einen für
          die Funktion der Webseite notwendigen Cookie. Dieser wird
          verschlüsselt auf Ihrem Gerät hinterlegt.
        </p>

        <p>
          Um den Dienst weiterzuentwickeln und zu analysieren, nutzen wir den
          Open Source Webanalysedienst plausible.io. Dieser erhebt jedoch weder
          personenbezogenen Daten, noch kommen dabei Cookies zum Einsatz.
          Weitere Informationen zu Plausible und der Datenverarbeitung finden
          Sie unter https://plausible.io/data-policy.
        </p>

        <h3>
          Welche Rechte (Auskunftsrecht, Widerspruchsrecht usw.) haben Sie?
        </h3>

        <p>
          Sie haben nach der Datenschutz-Grundverordnung verschiedene Rechte.
          Einzelheiten ergeben sich insbesondere aus Artikel 15 bis 18 und 21
          der Datenschutz-Grundverordnung.
        </p>

        <h4>Recht auf Auskunft</h4>

        <p>
          Sie können Auskunft über Ihre von uns verarbeiteten personenbezogenen
          Daten verlangen. In Ihrem Auskunftsantrag sollten Sie Ihr Anliegen
          präzisieren, um uns das Zusammenstellen der erforderlichen Daten zu
          erleichtern. Daher sollten in dem Antrag möglichst Angaben zum
          konkreten Prozessschritt gemacht werden.
        </p>

        <h4>Recht auf Berichtigung</h4>

        <p>
          Sollten die Sie betreffenden Angaben nicht (mehr) zutreffend sein,
          können Sie eine Berichtigung verlangen. Sollten Ihre Daten
          unvollständig sein, können Sie eine Vervollständigung verlangen.
        </p>

        <h4>Recht auf Löschung</h4>

        <p>
          Sie können die Löschung Ihrer personenbezogenen Daten verlangen. Ihr
          Anspruch auf Löschung hängt u. a. davon ab, ob die Sie betreffenden
          Daten von uns zur Erfüllung unserer gesetzlichen Aufgaben noch
          benötigt werden.
        </p>

        <h4>Recht auf Einschränkung der Verarbeitung</h4>

        <p>
          Sie haben das Recht, eine Einschränkung der Verarbeitung der Sie
          betreffenden Daten zu verlangen.
        </p>

        <h4>Recht auf Widerspruch</h4>

        <p>
          Sie haben das Recht, aus Gründen, die sich aus Ihrer besonderen
          Situation ergeben, jederzeit der Verarbeitung der Sie betreffenden
          Daten zu widersprechen.
        </p>

        <h4>Recht auf Beschwerde </h4>
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
          datenschutz@digitalservice.bund.de
        </p>

        <p>
          Bundesbeauftragter für Datenschutz und Informationsfreiheit
          <br /> Graurheindorfer Str. 153 - 53117 Bonn
          <br /> Telefon: +49 (0)228-997799-0
          <br /> Fax: +49 (0)228-997799-5550
          <br />
          E-Mail: poststelle@bfdi.bund.de <br />
          De-Mail: poststelle@bfdi.de-mail.de
          <br />
          Online-Beschwerde:
          www.bfdi.bund.de/DE/Service/Beschwerden/beschwerden_node.htm
        </p>
      </div>
    </SimplePageLayout>
  );
}
