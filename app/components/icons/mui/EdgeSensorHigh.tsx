import { SVGProps } from "react";

const EdgeSensorHigh = (props: SVGProps<SVGSVGElement>) => (
  <svg width="26" height="26" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g clip-path="url(#a)">
      <path
        d="M3.47 7.706h2.118v7.412H3.471V7.706ZM.295 10.882h2.118v7.412H.294v-7.412Zm23.294-3.176h2.118v7.412h-2.118V7.706Zm-3.176 3.176h2.117v7.412h-2.117v-7.412Zm-3.177-8.46-8.47-.01a2.124 2.124 0 0 0-2.118 2.117v16.942c0 1.164.953 2.117 2.118 2.117h8.47a2.124 2.124 0 0 0 2.118-2.117V4.529a2.115 2.115 0 0 0-2.118-2.107Zm0 19.049h-8.47v-1.06h8.47v1.06Zm0-3.177h-8.47V7.706h8.47v10.588ZM8.765 5.588V4.53h8.47v1.06h-8.47Z"
        fill="#4E596A"
      />
    </g>
    <defs>
      <clipPath id="a">
        <path
          fill="#fff"
          transform="translate(.294 .294)"
          d="M0 0h25.412v25.412H0z"
        />
      </clipPath>
    </defs>
  </svg>
);

export default EdgeSensorHigh;
