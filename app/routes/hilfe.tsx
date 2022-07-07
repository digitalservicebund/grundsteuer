import { MetaFunction } from "@remix-run/node";
import { pageTitle } from "~/util/pageTitle";
import {
  BreadcrumbNavigation,
  ContentContainer,
  LoggedOutLayout,
} from "~/components";
import Button from "~/components/Button";
import Hint from "~/components/Hint";
import EmailOutlined from "~/components/icons/mui/EmailOutlined";

export const meta: MetaFunction = () => {
  return { title: pageTitle("Hilfe") };
};

export default function Hilfe() {
  return (
    <LoggedOutLayout>
      <BreadcrumbNavigation />
      <ContentContainer>
        <h1 className="text-30 leading-36 md:pt-16 md:text-64 md:leading-68 max-w-[44rem] mb-32 md:mb-48">
          Haben Sie Fragen zu unserem Online-Dienst?
        </h1>

        <ContentContainer size="sm-md" className="mb-32 md:mb-48">
          <Hint>
            <strong>Bitte beachten Sie:</strong> Wir beantworten ausschließlich
            Fragen zum Produkt Grundsteuererklärung für Privateigentum.
          </Hint>
        </ContentContainer>

        <ContentContainer size="lg">
          <div
            className="bg-blue-200 p-24 md:pt-40 md:px-48 md:pb-48 mb-32"
            id="allgemeine-fragen"
          >
            <ContentContainer size="md">
              <h2 className="text-24 leading-30 md:text-30 md:leading-36 mb-24">
                Für allgemeine Fragen zur Grundsteuerreform oder Ihrem
                persönlichen Sachverhalt, möchten wir Sie auf die umfangreichen
                Hilfe-Seiten der Bundesländer verweisen.
              </h2>
            </ContentContainer>
            <ContentContainer size="sm" className="text-16 leading-26 mb-32">
              Wenn Sie also Fragen haben, wie zum Beispiel:
              <ul className="list-disc pl-24 mb-8">
                <li>Wer muss die Grundsteuererklärung abgeben?</li>
                <li>Wie wird Wohnfläche berechnet?</li>
                <li>Wie ermittelt man das Baujahr?</li>
              </ul>
              dann möchten wir Sie höflich bitten, sich an das entsprechende
              Informationsportal Ihres Landes zu wenden.
            </ContentContainer>
            <ContentContainer size="md">
              <h3
                className="text-20 leading-24 md:text-24 md:leading-30"
                id="informationsportale"
              >
                Informationsportale der Länder mit Bundesmodell
              </h3>
              <div className="text-16 leading-26">
                <h4 className="pt-24 font-bold" id="berlin">
                  Berlin
                </h4>
                <dl>
                  <dt className="clear-left md:float-left md:mr-8">
                    Allgemeine Informationen:
                  </dt>
                  <dd>
                    <a
                      href="https://www.berlin.de/grundsteuer/"
                      rel="noopener"
                      className="text-blue-800 font-bold underline"
                    >
                      Informationen für Grundstücke in Berlin
                    </a>
                  </dd>
                  <dt className="clear-left md:float-left md:mr-8">
                    Häufig gestellte Fragen:
                  </dt>
                  <dd>
                    <a
                      href="https://www.berlin.de/sen/finanzen/steuern/informationen-fuer-steuerzahler-/faq-steuern/artikel.9031.php"
                      rel="noopener"
                      className="text-blue-800 font-bold underline"
                    >
                      Fragen und Antworten zur Grundsteuerreform
                    </a>
                  </dd>
                  <dt className="clear-left md:float-left md:mr-8">
                    Informationen zur Grundsteuer-Festsetzung:
                  </dt>
                  <dd>
                    <a
                      href="https://www.berlin.de/grundsteuer/berlin/artikel.1182343.php"
                      rel="noopener"
                      className="text-blue-800 font-bold underline"
                    >
                      Grundbesitz in Berlin
                    </a>
                  </dd>
                </dl>

                <h4 className="pt-24 font-bold" id="brandenburg">
                  Brandenburg
                </h4>
                <dl>
                  <dt className="clear-left md:float-left md:mr-8">
                    Allgemeine Informationen:
                  </dt>
                  <dd>
                    <a
                      href="https://finanzamt.brandenburg.de/fa/de/themen/grundsteuer/#"
                      rel="noopener"
                      className="text-blue-800 font-bold underline"
                    >
                      Informationen für Grundstücke in Brandenburg
                    </a>
                  </dd>
                  <dt className="clear-left md:float-left md:mr-8">
                    Häufig gestellte Fragen:
                  </dt>
                  <dd>
                    <a
                      href="https://finanzamt.brandenburg.de/fa/de/themen/grundsteuer/unbebaute-und-bebaute-grundstuecke-wohnungseigentum-erbbaurecht/#"
                      rel="noopener"
                      className="text-blue-800 font-bold underline"
                    >
                      Fragen und Antworten zur Grundsteuerreform
                    </a>
                  </dd>
                </dl>

                <h4 className="pt-24 font-bold" id="bremen">
                  Bremen
                </h4>
                <dl>
                  <dt className="clear-left md:float-left md:mr-8">
                    Allgemeine Informationen:
                  </dt>
                  <dd>
                    <a
                      href="https://www.finanzen.bremen.de/steuern/grundsteuerreform-92715#:~:text=Der%20Hebesatz%20wird%20durch%20die,Hebesatz%20der%20Grundsteuer%20A%20250%20%25"
                      rel="noopener"
                      className="text-blue-800 font-bold underline"
                    >
                      Informationen für Grundstücke in Bremen
                    </a>
                  </dd>
                </dl>

                <h4 className="pt-24 font-bold" id="mecklenburg-vorpommern">
                  Mecklenburg-Vorpommern
                </h4>
                <dl>
                  <dt className="clear-left md:float-left md:mr-8">
                    Allgemeine Informationen:
                  </dt>
                  <dd>
                    <a
                      href="https://www.steuerportal-mv.de/Steuerrecht/Rund-ums-Grundst%C3%BCck/Grundsteuerreform/"
                      rel="noopener"
                      className="text-blue-800 font-bold underline"
                    >
                      Informationen für Grundstücke in Mecklenburg-Vorpommern
                    </a>
                  </dd>
                </dl>

                <h4 className="pt-24 font-bold" id="nordrhein-westfalen">
                  Nordrhein-Westfalen
                </h4>
                <dl>
                  <dt className="clear-left md:float-left md:mr-8">
                    Allgemeine Informationen:
                  </dt>
                  <dd>
                    <a
                      href="https://www.finanzverwaltung.nrw.de/Grundsteuerreform"
                      rel="noopener"
                      className="text-blue-800 font-bold underline"
                    >
                      Informationen für Grundstücke in Nordrhein-Westfalen
                    </a>
                  </dd>
                </dl>

                <h4 className="pt-24 font-bold" id="rheinland-pfalz">
                  Rheinland-Pfalz
                </h4>
                <dl>
                  <dt className="clear-left md:float-left md:mr-8">
                    Allgemeine Informationen:
                  </dt>
                  <dd>
                    <a
                      href="https://www.lfst-rlp.de/unsere-themen/grundsteuer"
                      rel="noopener"
                      className="text-blue-800 font-bold underline"
                    >
                      Informationen für Grundstücke in Rheinland-Pfalz
                    </a>
                  </dd>
                  <dt className="clear-left md:float-left md:mr-8">
                    Häufig gestellte Fragen:
                  </dt>
                  <dd>
                    <a
                      href="https://www.lfst-rlp.de/unsere-themen/grundsteuer/faq-grundsteuer"
                      rel="noopener"
                      className="text-blue-800 font-bold underline"
                    >
                      Fragen und Antworten zur Grundsteuerreform
                    </a>
                  </dd>
                </dl>

                <h4 className="pt-24 font-bold" id="saarland">
                  Saarland
                </h4>
                <dl>
                  <dt className="clear-left md:float-left md:mr-8">
                    Allgemeine Informationen:
                  </dt>
                  <dd>
                    <a
                      href="https://www.saarland.de/mfw/DE/portale/steuernundfinanzaemter/Grundsteuerreform/Grundsteuerreform_node.html"
                      rel="noopener"
                      className="text-blue-800 font-bold underline"
                    >
                      Informationen für Grundstücke im Saarland
                    </a>
                  </dd>
                </dl>

                <h4 className="pt-24 font-bold" id="sachsen">
                  Sachsen
                </h4>
                <dl>
                  <dt className="clear-left md:float-left md:mr-8">
                    Allgemeine Informationen:
                  </dt>
                  <dd>
                    <a
                      href="https://www.finanzamt.sachsen.de/grundsteuer-11198.html"
                      rel="noopener"
                      className="text-blue-800 font-bold underline"
                    >
                      Informationen für Grundstücke in Sachsen
                    </a>
                  </dd>
                  <dt className="clear-left md:float-left md:mr-8">
                    Häufig gestellte Fragen:
                  </dt>
                  <dd>
                    <a
                      href="https://www.finanzamt.sachsen.de/allgemeines-11760.html"
                      rel="noopener"
                      className="text-blue-800 font-bold underline"
                    >
                      Fragen und Antworten zur Grundsteuerreform
                    </a>
                  </dd>
                  <dt className="clear-left md:float-left md:mr-8">
                    Kontaktmöglichkeit:
                  </dt>
                  <dd>
                    <a
                      href="https://www.finanzamt.sachsen.de/kontakt-12557.html"
                      rel="noopener"
                      className="text-blue-800 font-bold underline"
                    >
                      Kontakt
                    </a>
                  </dd>
                </dl>

                <h4 className="pt-24 font-bold" id="sachsen-anhalt">
                  Sachsen-Anhalt
                </h4>
                <dl>
                  <dt className="clear-left md:float-left md:mr-8">
                    Allgemeine Informationen:
                  </dt>
                  <dd>
                    <a
                      href="https://mf.sachsen-anhalt.de/steuern/grundsteuer/#c271848"
                      rel="noopener"
                      className="text-blue-800 font-bold underline"
                    >
                      Informationen für Grundstücke in Sachsen-Anhalt
                    </a>
                  </dd>
                </dl>

                <h4 className="pt-24 font-bold" id="schleswig-holstein">
                  Schleswig-Holstein
                </h4>
                <dl>
                  <dt className="clear-left md:float-left md:mr-8">
                    Allgemeine Informationen:
                  </dt>
                  <dd>
                    <a
                      href="https://www.schleswig-holstein.de/DE/landesregierung/themen/finanzen/grundsteuerreform/grundsteuerreform_node.html"
                      rel="noopener"
                      className="text-blue-800 font-bold underline"
                    >
                      Informationen für Grundstücke in Schleswig-Holstein
                    </a>
                  </dd>
                </dl>

                <h4 className="pt-24 font-bold" id="thueringen">
                  Thüringen
                </h4>
                <dl>
                  <dt className="clear-left md:float-left md:mr-8">
                    Allgemeine Informationen:
                  </dt>
                  <dd>
                    <a
                      href="https://finanzen.thueringen.de/themen/steuern/grundsteuer"
                      rel="noopener"
                      className="text-blue-800 font-bold underline"
                    >
                      Informationen für Grundstücke in Thüringen
                    </a>
                  </dd>
                </dl>
              </div>
            </ContentContainer>
          </div>

          <div
            className="bg-white p-32 md:pt-40 md:px-48 md:pb-48 mb-80 md:mb-144"
            id="produkt-fragen"
          >
            <ContentContainer size="md">
              <h2 className="text-24 leading-30 md:text-30 md:leading-36 mb-24">
                Haben Sie eine Frage zum Produkt Grundsteuer&shy;erklärung für
                Privateigentum?
              </h2>
            </ContentContainer>
            <ContentContainer size="sm" className="text-16 leading-26 mb-24">
              Wenn Sie Fragen haben, wie zum Beispiel:
              <ul className="list-disc pl-24 mb-8">
                <li>Wie kann ich mich anmelden?</li>
                <li>Brauche ich einen Elster-Account für den Online-Dienst?</li>
                <li>
                  Ich habe ein Problem beim Ausfüllen des Online-Formulars. Was
                  kann ich tun?
                </li>
              </ul>
              dann möchten wir Sie höflich bitten, sich an folgende
              E-Mail-Adresse zu wenden:
            </ContentContainer>

            <Button
              href="mailto:hilfe@grundsteuererklaerung-fuer-privateigentum.de"
              look="ghost"
              size="medium"
              icon={<EmailOutlined />}
              className="md:hidden"
            >
              hilfe@grundsteuererklaerung-fuer-privateigentum.de
            </Button>

            <Button
              href="mailto:hilfe@grundsteuererklaerung-fuer-privateigentum.de"
              look="ghost"
              size="large"
              icon={<EmailOutlined />}
              className="hidden md:inline-flex"
            >
              hilfe@grundsteuererklaerung-fuer-privateigentum.de
            </Button>

            <ContentContainer size="sm-md">
              <p className="pt-24 text-16 leading-26">
                <strong>Wichtig:</strong> Bitte verwenden Sie in Ihrer E-Mail
                einen passenden Betreff. Das erleichtert uns die Bearbeitung der
                Anfragen. Ihre E-Mail wird ausschließlich zur Beantwortung Ihrer
                Anfrage verarbeitet und gespeichert.
              </p>
            </ContentContainer>
          </div>
        </ContentContainer>
      </ContentContainer>
    </LoggedOutLayout>
  );
}
