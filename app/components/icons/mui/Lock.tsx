import { SVGProps } from "react";

const Lock = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    fill="#000"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M18 8.5h-1v-2c0-2.76-2.24-5-5-5s-5 2.24-5 5v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-10c0-1.1-.9-2-2-2Zm-9-2c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9v-2Zm9 14H6v-10h12v10Zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2Z" />
  </svg>
);

export default Lock;
