import classNames from "classnames";
import { AccountCircle } from "~/components/icons/mui/AccountCircle";

export const UserLoggedIn = (props: { className?: string }) => {
  return (
    <div
      className={classNames(
        "flex flex-row whitespace-nowrap gap-8 items-center max-w-fit pl-12 pr-10 py-8 text-14 text-white italic bg-green-700 rounded-b",
        props.className
      )}
    >
      <AccountCircle />
      <div>Sie sind angemeldet</div>
    </div>
  );
};
