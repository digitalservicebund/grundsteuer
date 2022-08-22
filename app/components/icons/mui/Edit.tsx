import { SVGProps } from "react";

const Edit = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="36"
    height="36"
    fill="none"
    viewBox="0 0 36 36"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M21.088 13.53l1.38 1.38L8.878 28.5h-1.38v-1.38l13.59-13.59zm5.4-9.03c-.375 0-.765.15-1.05.435L22.693 7.68l5.625 5.625 2.745-2.745a1.494 1.494 0 0 0 0-2.115l-3.51-3.51c-.3-.3-.675-.435-1.065-.435zm-5.4 4.785l-16.59 16.59V31.5h5.625l16.59-16.59-5.625-5.625z"
      fill="#004B76"
    />
  </svg>
);

export default Edit;
