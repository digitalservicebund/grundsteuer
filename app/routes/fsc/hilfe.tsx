import { useLoaderData } from "@remix-run/react";
import {
  BreadcrumbNavigation,
  Button,
  ContentContainer,
  Headline,
} from "~/components";
import { json, LoaderFunction, redirect } from "@remix-run/node";
import { authenticator } from "~/auth.server";
import { findUserByEmail } from "~/domain/user";
import { FscRequest } from "~/domain/fscRequest";
import FscLetterHint from "~/components/fsc/FscLetterHint";
import LinkWithArrow from "~/components/LinkWithArrow";
import EnumeratedList from "~/components/EnumeratedList";
import { canEnterFsc } from "~/domain/identificationStatus";
import { logoutDeletedUser } from "~/util/logoutDeletedUser";
import { getBundesIdentUrl } from "~/routes/bundesIdent/_bundesIdentUrl";
import { flags } from "~/flags.server";

export const loader: LoaderFunction = async ({ request }) => {
  const sessionUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/anmelden",
  });
  const dbUser = await findUserByEmail(sessionUser.email);
  if (!dbUser) return logoutDeletedUser(request);

  if (!canEnterFsc(dbUser)) {
    return redirect("/fsc/beantragen");
  }

  return json({
    ...new FscRequest(dbUser.fscRequest!).getAntragStatus(),
    bundesIdentUrl: getBundesIdentUrl(request),
    bundesIdentDisabled: flags.isBundesIdentDisabled(),
    bundesIdentDown: flags.isBundesIdentDown(),
  });
};

export default function FscHilfe() {
  const {
    antragDate,
    letterArrivalDate,
    bundesIdentUrl,
    bundesIdentDisabled,
    bundesIdentDown,
  } = useLoaderData();

  const bundesIdentOffline = bundesIdentDisabled || bundesIdentDown;

  let alternatives = [
    <div>
      <p className="mb-8">
        <strong>Über Angehörige:</strong> Fragen Sie Ihre Angehörigen, ob Sie
        bereits einen identifizierten Account beim Online-Service
        "Grundsteuererklärung für Privateigentum" haben oder ob sie ein
        ELSTER-Zertifikat haben, womit Sie sich für Ihre Erklärung
        identifizieren können.
      </p>
      <LinkWithArrow href="https://grundsteuererklaerung-fuer-privateigentum.zammad.com/help/de-de/38/104">
        Mehr Informationen dazu
      </LinkWithArrow>
    </div>,
    <div>
      <p className="mb-8">
        <strong>Mit Elster-Zertifikat:</strong> Vielleicht haben Sie doch ein
        Elsterzertifikat und der Brief konnten Ihnen deshalb nicht zugstellt
        werden? Personen mit einem ELSTER Konto erhalten in der Regel keinen
        Brief mit einem Freischaltcode. Nutzen Sie Ihre ELSTER Zugangsdaten, um
        sich zu identifizieren.
      </p>
      <LinkWithArrow href="/ekona">
        Zur Identifikation mit ELSTER Zugang
      </LinkWithArrow>
    </div>,
    <div>
      <p className="mb-8">
        <strong>Papierformular:</strong> Ist Ihnen keine der Identifikationen
        möglich, können Sie Ihre Erklärung noch in Papierform abgeben.
      </p>
      <LinkWithArrow href="https://grundsteuererklaerung-fuer-privateigentum.zammad.com/help/de-de/53-abgabe-in-papierform/101-kann-ich-die-erklarung-auch-in-papierform-abgeben">
        Mehr Informationen dazu{" "}
      </LinkWithArrow>
    </div>,
  ];

  if (!bundesIdentOffline) {
    alternatives = [
      <div>
        <p className="mb-8">
          <strong>Mit Ausweis und Smartphone:</strong> Sie haben außerdem die
          Möglichkeit sich mit Ihrem Ausweis auf dem Smartphone zu
          identifizieren.
        </p>
        <LinkWithArrow href={bundesIdentUrl}>
          Zur Identifikation mit Personalausweis
        </LinkWithArrow>
      </div>,
      ...alternatives,
    ];
  }

  return (
    <>
      <ContentContainer size="sm-md" className="mb-80">
        <BreadcrumbNavigation />
        <Headline asLegend>
          Sie haben noch keinen Brief mit einem Freischaltcode erhalten?
        </Headline>
        <FscLetterHint
          antragDate={antragDate}
          letterArrivalDate={letterArrivalDate}
        />
        <div className="mb-32 text-18">
          <p>
            Die Zustellung Ihres beantragten Freischaltcodes braucht
            ungewöhnlich lang? Wenn er nach über 3 Wochen noch nicht bei Ihnen
            angekommen ist, scheint es ein Problem bei der Beantragung gegeben
            zu haben. Zum Beispiel:
          </p>
          <ul className="pl-24 mb-24 list-disc">
            <li>
              Die Post hat Probleme bei Zustellversuchen. Die Adresse konnte
              nicht gefunden werden; der Brief ist verloren gegangen oder die
              Feiertage sorgen für Zustellverzögerungen.
            </li>
            <li>
              Der Brief kann aufgrund einer falsch hinterlegten Meldeadresse
              nicht zugestellt werden. In diesem Fall überprüfen Sie bitte, ob
              Sie nach Ihrem letzten Umzug der Meldebehörde Ihre neue Adresse
              mitgeteilt haben.
            </li>
          </ul>
          <p>
            Sie können nochmal versuchen einen neuen Freischaltcode zu
            beantragen. <strong>Achtung:</strong> dies kann wiederum einige
            Wochen dauern und gegebenenfalls die Abgabe Ihrer
            Grundsteuererklärung verzögern. Wir empfehlen einen Freischaltcode
            maximal einmal neu zu beantragen.
          </p>
        </div>
        <LinkWithArrow href="/fsc/stornieren">
          Freischaltcode neu beantragen
        </LinkWithArrow>
      </ContentContainer>
      <ContentContainer
        size="lg"
        className="bg-white pt-32 pr-80 pb-16 pl-32 mb-48"
      >
        <ContentContainer size="sm-md">
          <h2 className="text-24 mb-24">
            Wie kann ich mich stattdessen identifizieren?
          </h2>
          <EnumeratedList gap="48" items={alternatives} />
        </ContentContainer>
      </ContentContainer>
      <Button to="/formular" className="min-w-[18rem]">
        Zurück zum Formular
      </Button>
    </>
  );
}
