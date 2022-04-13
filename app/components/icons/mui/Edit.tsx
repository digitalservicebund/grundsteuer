import { SVGProps } from "react";

const Edit = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="19"
    height="18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="m11 6 1 1-9 9H2v-1l9-9Zm3.7-6a1 1 0 0 0-.7.3L12 2 16 6 17.7 4c.4-.4.4-1 0-1.4L15.4.3a1 1 0 0 0-.7-.3ZM11 3.2 0 14.2V18h3.8l11-11-3.7-3.8Z"
      fill="#424C5A"
    />
  </svg>
);

export default Edit;
