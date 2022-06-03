import Button from "~/components/Button";
import classNames from "classnames";
import { useEffect, useState } from "react";

export default function FloatButton(props: any) {
  const { className, floatingBorderBottom, ...rest } = props;
  const fixedBottomPositionClasses =
    "fixed bottom-[1rem] md:bottom-[2rem] lg:bottom-[3rem]";
  const scrollingBottomPositionClasses =
    "absolute bottom-[1rem] md:bottom-[2rem] lg:bottom-[3rem]";
  const [bottomPositionClasses, setBottomPositionClasses] = useState(
    fixedBottomPositionClasses
  );

  const extendedClassName = classNames(
    className,
    bottomPositionClasses,
    `rounded-full right-[1rem] md:right-[2rem] lg:right-[3rem] shadow-xl`
  );

  const handleScroll = () => {
    const calcPos = window.scrollY + window.innerHeight;
    const bottomBorder =
      window.document.body.offsetHeight -
      (floatingBorderBottom - window.document.fonts.size * 3);
    setBottomPositionClasses(
      calcPos < bottomBorder
        ? fixedBottomPositionClasses
        : scrollingBottomPositionClasses
    );
  };

  useEffect(() => {
    const calcPos = window.scrollY + window.innerHeight;
    const bottomBorder =
      window.document.body.offsetHeight - floatingBorderBottom;
    setBottomPositionClasses(
      calcPos < bottomBorder
        ? fixedBottomPositionClasses
        : scrollingBottomPositionClasses
    );
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div style={{ position: "relative" }}>
      <Button className={extendedClassName} {...rest} />
    </div>
  );
}
