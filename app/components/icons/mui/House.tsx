import * as React from "react";
import { SVGProps } from "react";

const House = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="27"
    height="27"
    viewBox="0 0 27 27"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M3.85938 10.8203V21.8917C3.85938 22.6807 4.49897 23.3203 5.28795 23.3203H21.7165C22.5055 23.3203 23.1451 22.6807 23.1451 21.8917V10.8203"
      stroke="black"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M1 13.5L12.9949 1.50508C13.2739 1.22613 13.7261 1.22613 14.0051 1.50508L26 13.5"
      stroke="black"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M19.3906 6.53599V4.21456C19.3906 4.01732 19.5505 3.85742 19.7478 3.85742H21.3549C21.5522 3.85742 21.7121 4.01732 21.7121 4.21456V8.50028"
      stroke="black"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M11.3594 23.3217V16.1789C11.3594 15.5871 11.8391 15.1074 12.4308 15.1074H15.2879C15.8797 15.1074 16.3594 15.5871 16.3594 16.1789V23.3217"
      stroke="black"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export default House;
