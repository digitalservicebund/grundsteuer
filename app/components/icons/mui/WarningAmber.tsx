import { SVGProps } from "react";

const WarningAmber = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    enableBackground="new 0 0 24 24"
    height="1em"
    viewBox="0 0 24 24"
    width="1em"
    {...props}
  >
    <g>
      <rect fill="none" height={24} width={24} />
    </g>
    <g>
      <g>
        <g>
          <path
            d="M12,5.99L19.53,19H4.47L12,5.99 M12,2L1,21h22L12,2L12,2z"
            fill="currentColor"
          />
          <polygon points="13,16 11,16 11,18 13,18" fill="currentColor" />
          <polygon points="13,10 11,10 11,15 13,15" fill="currentColor" />
        </g>
      </g>
    </g>
  </svg>
);

export default WarningAmber;
