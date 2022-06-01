import Button from "~/components/Button";
import classNames from "classnames";

export default function FloatButton(props: any) {
  const { className, ...rest } = props;
  const extendedClassName = classNames(
    className,
    "rounded-full fixed bottom-[1rem] md:bottom-[2rem] lg:bottom-[3rem] right-[1rem] md:right-[2rem] lg:right-[3rem] shadow-xl"
  );

  return <Button className={extendedClassName} {...rest} />;
}
