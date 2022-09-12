import { useTranslation } from "react-i18next";
import { MetaFunction } from "@remix-run/node";
import { BmfLogo, Button, SimplePageLayout } from "~/components";
import ArrowBackIcon from "~/components/icons/mui/ArrowBack";
import { pageTitle } from "~/util/pageTitle";
import Hint from "~/components/Hint";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return { title: pageTitle("Impressum") };
};

export default function Impressum() {
  const { t } = useTranslation("all");
  return (
    <SimplePageLayout>
      <Button
        to="/"
        look="secondary"
        icon={<ArrowBackIcon />}
        className="mb-32"
      >
        {t("imprint.backButton")}
      </Button>

      <div className="mb-32 md:mb-64">
        <BmfLogo />
      </div>

      <h1 className="text-32 leading-40 mb-32 max-w-screen-sm md:text-64 md:leading-68 md:mb-48">
        {t("imprint.headline")}
      </h1>

      <div className="prose prose-xl mb-64">
        <h3>Angaben gemäß § 5 TMG</h3>
        <p>
          DigitalService GmbH des Bundes
          <br />
          Prinzessinnenstraße 8-14
          <br /> 10969 Berlin
          <br />
          Deutschland
        </p>

        <Hint>
          Bitte schicken Sie uns per Post <strong>keine</strong> Anlagen „
          <strong>Freischaltcode</strong> zum Datenabruf elektronischer
          Bescheinigungen“. Stattdessen geben Sie den Freischaltcode bitte nach
          der <Link to="/anmelden">erneuten Anmeldung</Link> unter
          “Identifikation” ein.{" "}
          <a
            href="https://grundsteuererklaerung-fuer-privateigentum.zammad.com/help/de-de/7-freischaltcode"
            rel="noopener"
            target="_blank"
          >
            Hier
          </a>{" "}
          finden Sie mehr Informationen dazu.
        </Hint>

        <p>
          Vertreten durch die Geschäftsführung: Frau Christina Lang, Herr
          Philipp Moeser
        </p>
        <p>
          Alleingesellschafterin: Bundesrepublik Deutschland, vertreten durch
          das Bundeskanzleramt
        </p>
        <p>
          Handelsregister-Nummer: HRB 212879 B<br />
          Registergericht: Berlin Charlottenburg
          <br />
          Umsatzsteueridentifikationsnummer: DE327075535
        </p>
        <h3>Kontakt</h3>
        <p>
          E-Mail:{" "}
          <a href="mailto:hilfe@grundsteuererklaerung-fuer-privateigentum.de">
            hilfe@grundsteuererklaerung-fuer-privateigentum.de
          </a>
        </p>
        <h3>Informationspflichten gemäß Art. 14 ODR-VO, § 36 VSBG</h3>
        <p>
          Die Europäische Kommission stellt eine Plattform zur
          Online-Streitbeilegung (OS) bereit:
          https://ec.europa.eu/consumers/odr.
        </p>
        <p>
          Im Falle von Problemen bitten wir unsere Nutzer:innen, sich über die
          angegebenen Kontaktdaten direkt an uns zu wenden.
        </p>
        <p>
          Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren
          vor einer Verbraucherschlichtungsstelle teilzunehmen.
        </p>

        <h3>Haftung für Inhalte</h3>
        <p>
          Als Diensteanbieter im Sinne von § 2 Nr. 1 TMG sind wir gemäß § 7 Abs.
          1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen
          Gesetzen verantwortlich. Wir sind nach §§ 8 bis 10 TMG jedoch nicht
          verpflichtet, übermittelte oder gespeicherte fremde Informationen zu
          überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige
          Tätigkeit hinweisen.
        </p>
        <p>
          Verpflichtungen zur Entfernung oder Sperrung der Nutzung von
          Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt.
          Eine dahingehende Haftung ist jedoch erst ab dem Zeitpunkt möglich, in
          dem wir Kenntnis von einer konkreten Rechtsverletzung erlangen.
          Sollten solche Rechtsverletzungen bekannt werden, werden wir die
          entsprechenden Inhalte umgehend entfernen.
        </p>

        <h3>Haftung für Verweise und Links</h3>
        <p>
          Unser Angebot enthält Links zu externen Websites Dritter, auf deren
          Inhalte wir keinen Einfluss haben. Deshalb können wir für diese
          fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der
          verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der
          Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der
          Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige
          Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar.
        </p>
        <p>
          {" "}
          Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch
          ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht mit
          zumutbarem Aufwand möglich. Sollten Rechtsverletzungen auf verlinkten,
          externen Seiten bekannt werden, werden wir die entsprechenden Links
          umgehend entfernen.
        </p>
        <h3>Urheberrecht</h3>
        <p>
          Die durch uns erstellten Inhalte und Werke auf diesen Seiten
          unterliegen dem deutschen Urheberrecht. Die Vervielfältigung,
          Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der
          Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung der
          jeweiligen Autor:in bzw. Ersteller:in. Downloads und Kopien dieser
          Seite sind nur für den privaten, nicht kommerziellen Gebrauch
          gestattet.
        </p>
        <p>
          Soweit die Inhalte auf dieser Seite nicht von uns erstellt wurden,
          werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte
          Dritter als solche gekennzeichnet. Sollten Sie auf eine
          Urheberrechtsverletzung aufmerksam werden, bitten wir um einen
          entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen
          werden wir derartige Inhalte umgehend entfernen.
        </p>
        <p>Illustrationen: unDraw https://undraw.co/license.</p>

        <h3>Verantwortlich für den Inhalt gemäß § 18 Abs. 2 MStV</h3>

        <p>
          DigitalService GmbH des Bundes
          <br /> Frau Christina Lang
          <br /> Prinzessinnenstraße 8-14
          <br /> 10969 Berlin
        </p>
      </div>
    </SimplePageLayout>
  );
}
