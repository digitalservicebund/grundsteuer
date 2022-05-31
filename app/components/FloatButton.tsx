import Button from "~/components/Button";
import classNames from "classnames";

export default function FloatButton(props: any) {
  const { className, ...rest } = props;
  const extendedClassName = classNames(
    className,
    "rounded-full fixed bottom-[60px] right-[60px] shadow-xl"
  );

  return <Button className={extendedClassName} {...rest} />;
}
