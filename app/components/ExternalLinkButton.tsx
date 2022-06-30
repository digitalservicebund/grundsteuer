import { Button } from "~/components/index";
import { ArrowRight } from "~/components/ArrowRight";
import { ReactNode } from "react";

export interface ExternalLinkButtonProps {
  url: string;
  border: boolean;
  classNames: string;
  children?: ReactNode;
}

export const ExternalLinkButton = (props: ExternalLinkButtonProps) => {
  return (
    <div className="mb-32">
      <Button
        size="large"
        look={props.border ? "tertiary" : "ghost"}
        href={props.url}
        target={"_blank"}
        icon={<ArrowRight />}
        className={props.classNames}
      >
        {props.children}
      </Button>
    </div>
  );
};
