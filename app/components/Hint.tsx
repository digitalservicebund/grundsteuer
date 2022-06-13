import Bell from "~/components/icons/mui/Bell";

export default function Hint(props: any) {
  const { title = "Hinweis", children } = props;
  return (
    <div
      className={"flex flex-col bg-yellow-200 rounded-lg px-36 py-24 mb-32 "}
    >
      <div className="flex items-center">
        <Bell className="mr-12 inline-block" />
        <p className="uppercase font-bold inline-block text-11">{title}</p>
      </div>
      <div className="pl-28">{children}</div>
    </div>
  );
}
