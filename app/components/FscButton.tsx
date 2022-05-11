import { Button } from "~/components";
import DriveFileRenameOutlineIcon from "~/components/icons/mui/DriveFileRenameOutline";

export default function FscButton() {
  return (
    <Button
      size="small"
      look="ghost"
      to="/fsc"
      icon={<DriveFileRenameOutlineIcon />}
    >
      Freischaltcode
    </Button>
  );
}
