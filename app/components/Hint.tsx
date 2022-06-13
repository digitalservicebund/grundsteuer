export default function Hint(props: any) {
  const { title = "Hinweis", children } = props;
  return (
    <div className={"bg-yellow-300 rounded-lg pr-[20%] p-16 mb-32 "}>
      <p className={"uppercase font-bold"}>{title}</p>
      {children}
    </div>
  );
}
