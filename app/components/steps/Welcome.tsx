import { StepComponentFunction } from "~/routes/formular/_step";

const Welcome: StepComponentFunction = () => {
  return (
    <>
      <p className="mb-32">
        Wir führen Sie mit einfachen Fragen und Hilfestellungen auf jeder Seite
        durch Ihre Erklärung zur Feststellung des Grundsteuerwerts.
      </p>

      <h2 className="font-bold">Welche Unterlagen brauchen Sie?</h2>
      <p className="mb-32">
        Damit Sie Ihre Daten möglichst bequem und schnell eingeben können, legen
        Sie sich am besten folgende Unterlagen bereit: Ihren Grundbuchauszug,
        das Informationsschreiben Ihrer Landesfinanzverwaltung (falls erhalten)
        Weitere Unterlagen wie Bauunterlagen, Einheitswertbescheid, letzter
        Grundsteuerbescheid, Versicherungspolice (falls zur Hand)
      </p>

      <h2 className="font-bold">Wichtige Hinweise:</h2>
      <ol className="mb-32 ml-[15px] list-decimal">
        <li>
          Um die Erklärung nach Eingabe aller Daten an Ihr Finanzamt übermitteln
          zu können, brauchen Sie einen{" "}
          <span className="font-bold underline">Freischaltcode</span>.
          Informationen dazu finden Sie jederzeit nach Klick auf den Link oben
          rechts auf dieser Seite.
        </li>
        <li>
          Alle Angaben beziehen sich auf den Zustand Ihres Grundstücks am{" "}
          <strong>01.01.2022</strong>. Faustregel: Stellen Sie sich bei jeder
          Angabe die Frage “Wie sah mein Grundstück am 01.01.2022 aus?”
        </li>
        <li>
          Mit unserem Online-Service geben Sie eine{" "}
          <strong>Hauptfeststellung</strong> ab. Das ist standardmäßig so, wenn
          Sie zum ersten Mal die Erklärung abgeben.
        </li>
        <li>
          Ihre Daten werden nur temporär in einem sogenannten{" "}
          <strong>Cookie</strong> gespeichert. Deshalb können Sie die
          Bearbeitung nur mit dem Gerät und dem Browser abbrechen und
          fortsetzen, mit denen Sie sich angemeldet haben. (Wenn Sie Ihre
          Browserdaten löschen, sind auch Ihre Eingaben gelöscht.)
        </li>
        <li>
          Für jedes Grundstück müssen Sie eine eigene Grundsteuererklärung
          abgeben.
        </li>
      </ol>
      <p>Jetzt kann es losgehen!</p>
    </>
  );
};

export default Welcome;
