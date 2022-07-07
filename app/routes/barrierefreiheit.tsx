import { useTranslation } from "react-i18next";
import { MetaFunction } from "@remix-run/node";
import { BmfLogo, ContentContainer, LoggedOutLayout } from "~/components";
import { pageTitle } from "~/util/pageTitle";

export const meta: MetaFunction = () => {
  return { title: pageTitle("Nutzungsbedingungen") };
};

export default function Nutzungsbedingungen() {
  const { t } = useTranslation("all");
  return (
    <LoggedOutLayout>
      <div className="mb-32 md:mb-64">
        <BmfLogo />
      </div>

      <ContentContainer size="md">
        <h1 className="text-32 leading-40 mb-32 max-w-screen-sm md:text-64 md:leading-68 md:mb-48">
          {t("barrierefreiheit.headline")}
        </h1>
        <p className="mb-24">
          Der Online-Service “Grundsteuererklärung für Privateigentum” ist
          bemüht, seine Website im Einklang mit den nationalen
          Rechtsvorschriften zur Umsetzung der Richtlinie (EU) 2016/2102 des
          Europäischen Parlaments und des Rates barrierefrei zugänglich zu
          machen. Diese Erklärung zur Barrierefreiheit gilt für die aktuell im
          Internet erreichbare Version der Website{" "}
          <a
            className="text-blue-900 underline"
            href="https://www.grundsteuererklaerung-fuer-privateigentum.de"
          >
            www.grundsteuererklaerung-fuer-privateigentum.de
          </a>
          . Sie wurde am 04.07.2022 erstellt.
        </p>

        <h2 className="text-24 mb-16">Wie barrierefrei ist das Angebot?</h2>
        <p>
          Dieser Service wurde neu entwickelt. Das Team hat ein Accessibility
          Training absolviert, in dem die meisten Bereiche des Online-Services
          auf Barrierefreiheit überprüft wurden. Der Service ist größtenteils
          barrierefrei. An den unten aufgeführten Mängeln wird gearbeitet.
        </p>
        <p className="mb-24">
          Der Online-Service “Grundsteuererklärung für Privateigentum” wird
          außerdem in den kommenden Wochen kontinuierlich auf Basis der
          Testergebnisse und der Rückmeldung der Nutzer:innen weiterentwickelt.
        </p>

        <h2 className="text-24 mb-16">
          Welche Bereiche sind nicht barrierefrei?
        </h2>
        <ul className="mb-24 list-disc ml-[15px]">
          <li>
            Fehlermeldungen: Aktuell können die Fehlermeldungen vom Screenreader
            nicht vorgelesen werden. Wir haben uns als Ziel gesetzt, dieses
            Problem möglichst schnell zu beheben.
          </li>
          <li>
            PDF-Download: Die PDF-Datei zur Vorbereitung ist zurzeit nicht
            barrierefrei.
          </li>
        </ul>

        <h2 className="text-24 mb-16">Kontakt und Feedback-Möglichkeit</h2>
        <p className="mb-24">
          Sind Ihnen Mängel beim barrierefreien Zugang zu Inhalten von
          aufgefallen? Dann können Sie sich gerne bei uns melden:{" "}
          <a
            className="text-blue-900 underline"
            href="mailto:hilfe@grundsteuererklaerung-fuer-privateigentum.de"
          >
            hilfe@grundsteuererklaerung-fuer-privateigentum.de
          </a>
          .
        </p>

        <h2 className="text-24 mb-16">Schlichtungsverfahren</h2>
        <p>
          Beim Beauftragten der Bundesregierung für die Belange von Menschen mit
          Behinderungen gibt es eine Schlichtungsstelle gemäß § 16 BGG. Die
          Schlichtungsstelle hat die Aufgabe, Konflikte zwischen Menschen mit
          Behinderungen und öffentlichen Stellen des Bundes zu lösen.
        </p>
        <p>
          Sie können die Schlichtungsstelle einschalten, wenn Sie mit den
          Antworten aus der oben genannten Kontaktmöglichkeit nicht zufrieden
          sind. Dabei geht es nicht darum, Gewinner oder Verlierer zu finden.
          Vielmehr ist es das Ziel, mit Hilfe der Schlichtungsstelle gemeinsam
          und außergerichtlich eine Lösung für ein Problem zu finden. Das
          Schlichtungsverfahren ist kostenlos. Sie brauchen auch keinen
          Rechtsbeistand.
        </p>
        <p className="mb-24">
          Auf der Internetseite der Schlichtungsstelle finden Sie alle
          Informationen zum Schlichtungsverfahren. Dort können Sie nachlesen,
          wie ein Schlichtungsverfahren abläuft und wie Sie den Antrag auf
          Schlichtung stellen. Sie können den Antrag auch in Leichter Sprache
          oder in Deutscher Gebärdensprache stellen.
        </p>
        <p>Sie erreichen die Schlichtungsstelle unter folgender Adresse:</p>
        <div className="bg-blue-300 p-16 mb-64">
          <p>
            Schlichtungsstelle nach dem Behindertengleichstellungsgesetz bei dem
            Beauftragten der Bundesregierung für die Belange von Menschen mit
            Behinderungen
          </p>
          <p>Mauerstraße 53</p>
          <p>10117 Berlin</p>
          <p>Telefon: 030 18 527 2805</p>
          <p>
            E-Mail:{" "}
            <a
              className="text-blue-900 underline"
              href="mailto:info@schlichtungsstelle-bgg.de"
            >
              info@schlichtungsstelle-bgg.de
            </a>
            .
          </p>
          <p>
            Internet:{" "}
            <a
              href="https://www.schlichtungsstelle-bgg.de"
              className="text-blue-800 underline"
            >
              www.schlichtungsstelle-bgg.de
            </a>
          </p>
        </div>
      </ContentContainer>
    </LoggedOutLayout>
  );
}
