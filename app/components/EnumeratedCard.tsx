import { ReactNode } from "react";
import classNames from "classnames";

export default function EnumeratedCard(props: {
  image: string;
  imageAltText: string;
  number: string;
  heading: ReactNode | string;
  text: ReactNode | string;
  className?: string;
}) {
  return (
    <div
      className={classNames(
        "py-24 lg:px-32 px-24 enumerate-card flex-col md:flex-row",
        props.className
      )}
    >
      <img
        src={props.image}
        alt={props.imageAltText}
        className="mr-24 md:w-[300px] md:h-[180px] w-full"
      />
      <div className="flex flex-col">
        <dl>
          <div className="flex flex-row mt-16 lg:mt-0">
            <div className="mr-8 enumerate-icon">{props.number}</div>
            <dt className="mb-8 mt-8 text-18">{props.heading}</dt>
          </div>
          <div className="flex flex-row mt-16 lg:mt-0">
            <div className="hidden sm:block mr-8 w-[40px] min-w-[40px]" />
            <dd>{props.text}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
