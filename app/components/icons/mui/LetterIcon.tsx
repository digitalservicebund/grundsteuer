import { SVGProps } from "react";

const LetterIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="1.25em"
    height="1em"
    viewBox="0 0 30 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M30 3c0-1.65-1.35-3-3-3H3C1.35 0 0 1.35 0 3v18c0 1.65 1.35 3 3 3h24c1.65 0 3-1.35 3-3V3Zm-3 0-12 7.485L3 3h24Zm0 18H3V6l12 7.5L27 6v15Z"
      fill="#004B76"
    />
  </svg>
);

export default LetterIcon;
