import { SVGProps } from "react";

const Slash = (props: SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    width="17"
    height="36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M16 1 1 35" stroke="#4E596A" strokeWidth="2" />
  </svg>
);

export default Slash;
