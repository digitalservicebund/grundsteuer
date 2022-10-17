import { SVGProps } from "react";

const Bolt = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="26"
    height="26"
    fill="#4E596A"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M11.936 22.53h-1.059l1.06-7.412H8.23c-.931 0-.349-.795-.328-.826 1.366-2.414 3.42-6.014 6.163-10.821h1.058l-1.058 7.411h3.716c.424 0 .657.202.424.7-4.183 7.294-6.269 10.947-6.269 10.947Z" />
  </svg>
);

export default Bolt;
