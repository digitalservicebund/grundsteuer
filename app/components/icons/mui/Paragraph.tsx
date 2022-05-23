import { SVGProps } from "react";

const Paragraph = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="18"
    height="12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 18 12"
    {...props}
  >
    <path
      d="M18 5.01 0 5v2h18V5.01ZM0 10h12v2H0v-2ZM18 0H0v2.01L18 2V0Z"
      fill="#004B76"
    />
  </svg>
);

export default Paragraph;
