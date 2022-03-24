import { SVGProps } from "react";

const House = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M19 9.8V4.5H16V7.1L12 3.5L2 12.5H5V20.5H11V14.5H13V20.5H19V12.5H22L19 9.8ZM17 18.5H15V12.5H9V18.5H7V10.69L12 6.19L17 10.69V18.5Z"
      fill="black"
    />
    <path
      d="M10 10.5H14C14 9.4 13.1 8.5 12 8.5C10.9 8.5 10 9.4 10 10.5Z"
      fill="black"
    />
  </svg>
);

export default House;
