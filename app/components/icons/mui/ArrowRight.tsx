import { SVGProps } from "react";

const ArrowRight = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="36"
    height="36"
    viewBox="0 0 36 36"
    fill="#004B76"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fill="#004B76"
      d="m18 6-2.115 2.115 8.37 8.385H6v3h18.255l-8.37 8.385L18 30l12-12L18 6Z"
    />
  </svg>
);

export default ArrowRight;
