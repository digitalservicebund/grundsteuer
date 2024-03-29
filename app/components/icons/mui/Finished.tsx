import { SVGProps } from "react";

const Finished = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="1em"
    height="1em"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    viewBox="0 0 20 20"
    aria-label="Fertig"
    {...props}
  >
    <title>Fertig</title>
    <path
      d="M10 0a10 10 0 1 0 0 20 10 10 0 0 0 0-20ZM8 15l-5-5 1.4-1.4L8 12.2l7.6-7.6L17 6l-9 9Z"
      fill="#01854A"
    />
  </svg>
);

export default Finished;
