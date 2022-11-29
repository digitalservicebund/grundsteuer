import {
  Button,
  ContentContainer,
  LogoutButton,
  NavigationActions,
  NavigationLink,
  TopNavigation,
} from "~/components";
import logo from "~/assets/images/logo.svg";
import Edit from "~/components/icons/mui/Edit";
import { UserLoggedIn } from "../UserLoggedIn";
import { Link } from "@remix-run/react";

export default function Header({
  email,
  noLoginLink,
}: {
  email?: string;
  noLoginLink?: boolean;
}) {
  return (
    <header>
      <div className="lg:hidden">
        <TopNavigation
          actions={<NavigationActions email={email} formularLink />}
        ></TopNavigation>
      </div>

      <div className="hidden lg:block bg-white lg:shadow-[0px_4px_10px_rgba(0,0,0,0.1)] lg:relative lg:z-10">
        <ContentContainer className="w-full flex flex-row justify-between">
          <Link to="/" className="block py-32">
            <img src={logo} alt="Grundsteuererklärung für Privateigentum" />
          </Link>
          {!email && !noLoginLink ? (
            <div className="flex items-center">
              <Button
                look="ghost"
                size="small"
                icon={<Edit className="text-blue-800" />}
                className="underline"
                to="/anmelden"
              >
                Bearbeitung fortsetzen
              </Button>
            </div>
          ) : (
            ""
          )}
          {email && (
            <div className="flex flex-col items-end">
              <UserLoggedIn email={email} />
              <div className="flex pt-16">
                <NavigationLink
                  to="/formular"
                  icon={<Edit className="w-24 h-24 text-blue-800" />}
                  isAllCaps
                >
                  Zum Formular
                </NavigationLink>
                <LogoutButton />
              </div>
            </div>
          )}
        </ContentContainer>
      </div>
    </header>
  );
}
