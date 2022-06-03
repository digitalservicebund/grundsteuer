import { ReactNode, useState } from "react";
import YellowArrowLeft from "~/components/icons/mui/YellowArrowLeft";
import HelpOutline from "~/components/icons/mui/HelpOutline";
import HighlightOff from "~/components/icons/mui/HighlightOff";

export default function Hilfestellung(props: {
  isShown: boolean;
  children: ReactNode;
}) {
  const { isShown = true, children } = props;
  const [isDisplayed, setIsDisplayed] = useState(isShown);

  const shownComponent = (
    <>
      <div className={"flex flex-col lg:flex-row"}>
        <div className={"hidden lg:flex lg:flex-col"}>
          <div className={"flex"}>
            <div className={"pt-16"}>
              <YellowArrowLeft />
            </div>
            <div
              className={
                "pt-16 bg-yellow-500 rounded-tl-lg w-[50px] flex justify-center"
              }
            >
              <HelpOutline />
            </div>
          </div>
          <div className={"flex flex-grow"}>
            <div>
              <YellowArrowLeft className={"invisible"} />
            </div>
            <div className={"bg-yellow-500 rounded-bl-lg w-[50px]"} />
          </div>
        </div>
        <div className={"bg-yellow-500 h-8 lg:hidden"} />
        <div className={"bg-white"}>
          <div
            className={"py-10 px-10 lg:hidden"}
            onClick={() => {
              setIsDisplayed(false);
            }}
          >
            <HighlightOff className={"ml-auto"} />
          </div>
          <div
            className={
              "pb-24 px-16 child-p:pr-[20%] md:px-24 lg:py-32 lg:px-24"
            }
          >
            {children}
          </div>
        </div>
      </div>
    </>
  );
  if (isDisplayed) {
    return shownComponent;
  } else {
    return <></>;
  }
}
