import { SVGProps } from "react";

const Attention = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="22"
    height="20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="m11 4.49 7.53 13.01H3.47L11 4.49ZM11 .5l-11 19h22L11 .5Zm1 14h-2v2h2v-2Zm0-6h-2v4h2v-4Z"
      fill="#000"
    />
  </svg>
);

export default Attention;
