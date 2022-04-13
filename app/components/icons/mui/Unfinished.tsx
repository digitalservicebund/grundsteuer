import { SVGProps } from "react";

const Unfinished = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="20"
    height="20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M14.6 5.6 8 12.2 4.4 8.6 3 10l5 5 8-8-1.4-1.4ZM10 0a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z"
      fill="#717A88"
    />
  </svg>
);

export default Unfinished;
