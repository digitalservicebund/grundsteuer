import { SVGProps } from "react";

const HelpOutline = (props: SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    width="36"
    height="36"
    fill="none"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>Fragezeichen</title>
    <path
      d="M16.5 27h3v-3h-3v3ZM18 3C9.72 3 3 9.72 3 18c0 8.28 6.72 15 15 15 8.28 0 15-6.72 15-15 0-8.28-6.72-15-15-15Zm0 27c-6.615 0-12-5.385-12-12S11.385 6 18 6s12 5.385 12 12-5.385 12-12 12Zm0-21c-3.315 0-6 2.685-6 6h3c0-1.65 1.35-3 3-3s3 1.35 3 3c0 3-4.5 2.625-4.5 7.5h3c0-3.375 4.5-3.75 4.5-7.5 0-3.315-2.685-6-6-6Z"
      fill="#000"
    />
  </svg>
);

export default HelpOutline;
