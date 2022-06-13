import { SVGProps } from "react";

const Info = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    fill="none"
    {...props}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm1 15h-2v-6h2v6Zm0-8h-2V7h2v2Z"
      fill="#000"
    />
  </svg>
);

export default Info;
