import classNames from "classnames";
import { AccountCircle } from "~/components/icons/mui/AccountCircle";

export const UserLoggedIn = (props: { email: string; className?: string }) => {
  return (
    <div
      className={classNames(
        "flex flex-row whitespace-nowrap gap-8 items-center max-w-fit pl-12 pr-10 py-8 text-14 text-white italic bg-green-700 rounded-b",
        props.className
      )}
    >
      <AccountCircle className="flex-shrink-0" />
      <div title={props.email} className="overflow-hidden overflow-ellipsis">
        {props.email}
      </div>
    </div>
  );
};
