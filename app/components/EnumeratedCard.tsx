import { ReactNode } from "react";
import classNames from "classnames";

interface EnumeratedCard {
  image: string;
  imageAltText: string;
  number?: string;
  heading: ReactNode | string;
  text: ReactNode | string;
  imageStyle?: string;
  className?: string;
}

export default function EnumeratedCard({
  imageStyle = "mr-24 md:w-[300px] md:h-[180px] w-full",
  ...props
}: EnumeratedCard) {
  return (
    <div
      className={classNames(
        "py-24 lg:px-32 px-24 enumerate-card flex-col md:flex-row max-w-[970px]",
        props.className
      )}
    >
      <img src={props.image} alt={props.imageAltText} className={imageStyle} />
      <div className="flex flex-col">
        <dl>
          <div className="flex flex-row mt-24 md:mt-0">
            {props.number && (
              <div className="mr-8 enumerate-icon">{props.number}</div>
            )}
            <dt className="mb-8 mt-8 text-18">{props.heading}</dt>
          </div>
          <div className="flex flex-row mt-8 lg:mt-0">
            {props.number && (
              <div className="hidden sm:block mr-8 w-[40px] min-w-[40px]" />
            )}
            <dd>{props.text}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
