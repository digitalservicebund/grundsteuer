import { LogoutButton } from "~/components";
import { UserLoggedIn } from "~/components/UserLoggedIn";

type LogoutMenuProps = {
  containerClasses: string;
  statusClasses: string;
};

export default function LogoutMenu(props: LogoutMenuProps) {
  return (
    <div data-testid="logout-menu" className={props.containerClasses}>
      <UserLoggedIn className={props.statusClasses} />
      <LogoutButton />
    </div>
  );
}
