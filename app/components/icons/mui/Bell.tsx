import { SVGProps } from "react";

const Bell = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M8 19.75c1.1 0 2-.9 2-2H6c0 1.1.9 2 2 2Zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32v-.68C9.5.92 8.83.25 8 .25s-1.5.67-1.5 1.5v.68C3.64 3.11 2 5.67 2 8.75v5l-2 2v1h16v-1l-2-2Zm-2 1H4v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6Z"
      fill="#000"
    />
  </svg>
);

export default Bell;
