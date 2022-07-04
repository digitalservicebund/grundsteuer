import { Button } from "~/components/index";
import { ArrowRightLong } from "~/components/icons/mui/ArrowRightLong";
import { ReactNode } from "react";

export interface ExternalLinkButtonProps {
  url: string;
  border: boolean;
  classNames?: string;
  children?: ReactNode;
}

export const ExternalLinkButton = (props: ExternalLinkButtonProps) => {
  return (
    <Button
      size="large"
      look={props.border ? "tertiary" : "ghost"}
      href={props.url}
      target={"_blank"}
      icon={<ArrowRightLong />}
      className={props.classNames}
    >
      {props.children}
    </Button>
  );
};
