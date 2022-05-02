import { MetaFunction } from "@remix-run/node";
import {
  Button,
  ContentContainer,
  Headline,
  IntroText,
  UserLayout,
} from "~/components";
import { pageTitle } from "~/util/pageTitle";

export const meta: MetaFunction = () => {
  return { title: pageTitle("Registrierung erfolgreich") };
};

export default function RegistrierenErfolgreich() {
  return (
    <UserLayout>
      <ContentContainer size="sm">
        <Headline>Vielen Dank!</Headline>
        <IntroText>Sie haben ein Konto erstellt.</IntroText>

        <Button to="/anmelden?registered=1">Weiter zum Anmelden</Button>
      </ContentContainer>
    </UserLayout>
  );
}
