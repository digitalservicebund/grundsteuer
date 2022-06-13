import { SVGProps } from "react";

const Cancel = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    fill="none"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2Zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59Z"
      fill="#000"
    />
  </svg>
);

export default Cancel;
