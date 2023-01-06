import { Link } from "@remix-run/react";
import Button from "./Button";
import Edit from "./icons/mui/Edit";

type HomepageCallToActionProps = {
  userIsLoggedIn: boolean;
  userWasLoggedIn: boolean;
  pruefenPath: string;
};

const UserIsLoggedIn = () => {
  return (
    <>
      <h3 className="pt-24 text-18 leading-26 mb-24">
        Bearbeiten Sie Ihre Grundsteuererklärung weiter und kehren Sie zurück
        ins Formular.
      </h3>
      <Button
        size="large"
        look="tertiary"
        icon={<Edit />}
        to="/formular"
        className="mb-32 lg:mb-64"
        fullWidth
      >
        Zum Formular
      </Button>
    </>
  );
};

const UserWasLoggedIn = (props: { pruefenPath: string }) => {
  return (
    <>
      <h3 className="pt-24 text-18 leading-26 mb-24">
        Melden Sie sich in Ihrem Konto an und setzen Sie Ihre Bearbeitung fort.
      </h3>
      <Button
        size="large"
        icon={<Edit />}
        to="/anmelden"
        className="mb-32 lg:mb-64"
        fullWidth
      >
        Bearbeitung fortsetzen
      </Button>

      <h3 className="text-18 leading-26 mb-16">
        Sie sind das erste Mal hier und haben sich noch nicht registriert? Dann
        erstellen Sie jetzt ein Konto und beginnen Sie Ihre
        Grundsteuererklärung.
      </h3>

      <Link
        to={props.pruefenPath}
        className="text-18 text-blue-800 underline font-bold"
      >
        Grundsteuererklärung starten
      </Link>
    </>
  );
};

const Default = (props: { pruefenPath: string }) => {
  return (
    <>
      <Button
        size="large"
        to={props.pruefenPath}
        className="mb-32 lg:mb-64"
        fullWidth
      >
        Grundsteuererklärung starten
      </Button>

      <h3 className="text-18 leading-26 mb-16">
        Sie haben bereits ein Konto und wollen Ihre Grundsteuererklärung weiter
        bearbeiten?
      </h3>

      <Link
        to="/anmelden"
        className="text-18 text-blue-800 underline font-bold inline-flex items-center"
      >
        <Edit className="mr-8 w-24 h-24" />
        Bearbeitung fortsetzen
      </Link>
    </>
  );
};

export default function HomepageCallToAction({
  userIsLoggedIn,
  userWasLoggedIn,
  pruefenPath,
}: HomepageCallToActionProps) {
  if (userIsLoggedIn) return <UserIsLoggedIn />;
  if (userWasLoggedIn) return <UserWasLoggedIn pruefenPath={pruefenPath} />;
  return <Default pruefenPath={pruefenPath} />;
}
