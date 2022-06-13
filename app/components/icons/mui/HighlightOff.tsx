import { SVGProps } from "react";

const HighlightOff = (props: SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    width="24"
    height="24"
    fill="none"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>Kreuz in Kreis</title>
    <path
      d="M14.59 8 12 10.59 9.41 8 8 9.41 10.59 12 8 14.59 9.41 16 12 13.41 14.59 16 16 14.59 13.41 12 16 9.41 14.59 8ZM12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2Zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8Z"
      fill="#000"
    />
  </svg>
);

export default HighlightOff;
