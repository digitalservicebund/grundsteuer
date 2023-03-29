import { LoaderFunction, MetaFunction, json, redirect } from "@remix-run/node";
import { pageTitle } from "~/util/pageTitle";
import { authenticator } from "~/auth.server";
import {
  Button,
  ButtonContainer,
  ContentContainer,
  Headline,
} from "~/components";
import bundesIdentCardsImage from "~/assets/images/bundesident-cards.png";
import { commitSession, getSession } from "~/session.server";

export const meta: MetaFunction = () => {
  return { title: pageTitle("Identifikation mit Ausweis") };
};

export const loader: LoaderFunction = async ({ request }) => {
  const sessionUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/anmelden",
  });
  if (sessionUser.identified) {
    return redirect("/identifikation/erfolgreich");
  }

  const session = await getSession(request.headers.get("Cookie"));
  session.set("hasPrimaryOptionShown", true);

  return json(
    {},
    {
      headers: { "Set-Cookie": await commitSession(session) },
    }
  );
};

export default function BundesIdentVoraussetzung() {
  return (
    <>
      <ContentContainer size="sm-md">
        <div data-testid="primaryoption">
          <Headline>
            Möchten Sie sich in wenigen Minuten mit Ihrem Ausweis
            identifizieren?
          </Headline>
          <ul className="text-18">
            <li className="mb-16">
              Damit wir sicher gehen können, dass Sie die Person sind, die die
              Grundsteuererklärung abgibt, müssen Sie sich identifizieren.
            </li>
            <li className="mb-16">
              In Ihrem Ausweis befindet sich ein Chip, der mithilfe der
              BundesIdent App und Ihrer PIN ausgelesen werden kann. So können
              Sie sich sicher online identifizieren.
            </li>
          </ul>
          <div className="flex justify-center mb-12 bg-blue-200 rounded-lg">
            <img
              src={bundesIdentCardsImage}
              className="max-w-[520px] h-[256px]"
              alt="Drei kompatible Ausweise: Deutscher Personalausweis, elektronischer Aufenthaltstitel und eID‑Karte für Bürgerinnen und Bürger der Europäischen Union und des europäischen Wirtschaftsraums."
            />
          </div>
          <p className="italic leading-[18.2px] text-14 mb-32">
            Drei kompatible Ausweise: Deutscher Personalausweis, elektronischer
            Aufenthaltstitel und eID‑Karte für Bürgerinnen und Bürger der
            Europäischen Union und des europäischen Wirtschaftsraums.
          </p>
        </div>
      </ContentContainer>
      <ButtonContainer className="max-w-[520px] lg:max-w-[543px]">
        <Button
          className="w-full lg:max-w-[252px]"
          look="primary"
          to="/bundesIdent/voraussetzung"
        >
          Identifikation mit Ausweis
        </Button>
        <Button
          className="w-full lg:max-w-[267px]"
          look="tertiary"
          to="/identifikation"
        >
          Alle Identifikationsoptionen
        </Button>
      </ButtonContainer>
      <div className="mt-[60px]">
        <p className="text-18 leading-26">
          Bei Fragen oder Problemen melden Sie sich unter:{" "}
          <a
            href="mailto:hilfe@bundesident.de"
            className="font-bold text-blue-800 underline"
          >
            hilfe@bundesident.de
          </a>
        </p>
      </div>
    </>
  );
}
