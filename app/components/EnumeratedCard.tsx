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
    <div className={classNames("py-24 px-32 enumerate-card", props.className)}>
      <img
        src={props.image}
        alt={props.imageAltText}
        className="mr-24 w-[300px] h-[180px]"
      />
      <div className="mr-8 enumerate-icon">{props.number}</div>
      <dl>
        <dt className="mb-8 mt-8 text-18">{props.heading}</dt>
        <dd>{props.text}</dd>
      </dl>
    </div>
  );
}
