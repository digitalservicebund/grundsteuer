export default function Hinweis(props: any) {
  const { title = "Hinweis", children } = props;
  return (
    <div className={"bg-red-200 rounded-lg pr-[20%] py-16 p-16 mb-16 "}>
      <p className={"uppercase font-bold"}>{title}</p>
      {children}
    </div>
  );
}
