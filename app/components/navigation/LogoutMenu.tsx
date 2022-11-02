import { LogoutButton } from "~/components";
import { UserLoggedIn } from "~/components/UserLoggedIn";
import classNames from "classnames";

type LogoutMenuProps = {
  email: string;
  containerClasses: string;
  statusClasses: string;
};

export default function LogoutMenu(props: LogoutMenuProps) {
  return (
    <div
      data-testid="logout-menu"
      className={classNames("z-50", props.containerClasses)}
    >
      <UserLoggedIn email={props.email} className={props.statusClasses} />
      <LogoutButton />
    </div>
  );
}
