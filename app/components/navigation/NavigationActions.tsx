import { Button, FscButton, LogoutButton } from "~/components";
import EmailOutlinedIcon from "~/components/icons/mui/EmailOutlined";

export default function NavigationActions(props: {
  userIsIdentified?: boolean;
  userIsLoggedIn?: boolean;
}) {
  if (!props.userIsLoggedIn) return null;

  return (
    <div>
      <LogoutButton />
      {!props.userIsIdentified && <FscButton />}
      <Button
        to="/formular/zusammenfassung"
        look="ghost"
        size="small"
        icon={<EmailOutlinedIcon />}
      >
        Prüfen & Versenden
      </Button>
      <br />
    </div>
  );
}
