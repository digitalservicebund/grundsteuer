import { SVGProps } from "react";

const LetterIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 36 36"
    fill="none"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <title>Brief</title>
    <path
      d="M33 9c0-1.65-1.35-3-3-3H6C4.35 6 3 7.35 3 9v18c0 1.65 1.35 3 3 3h24c1.65 0 3-1.35 3-3V9Zm-3 0-12 7.485L6 9h24Zm0 18H6V12l12 7.5L30 12v15Z"
      fill="#004B76"
    />
  </svg>
);

export default LetterIcon;
