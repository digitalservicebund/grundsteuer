import { SVGProps } from "react";

const AddFile = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="20"
    height="16"
    viewBox="-2 -4 24 24"
    fill="#004B76"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M18 2h-8L8 0H2C.89 0 .01.89.01 2L0 14c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V4c0-1.11-.89-2-2-2Zm0 12H2V2h5.17l2 2H18v10Zm-8-4h2v2h2v-2h2V8h-2V6h-2v2h-2v2Z" />
  </svg>
);

export default AddFile;
