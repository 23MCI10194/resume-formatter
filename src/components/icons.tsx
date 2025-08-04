import type { SVGProps } from 'react';

export const Icons = {
  logo: (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      fill="currentColor"
      {...props}
    >
      <rect width="256" height="256" fill="black" rx="32" ry="32"></rect>
      <path
        d="M164 68H92V88H112V168H92V188H164C186.091 188 204 170.091 204 148V108C204 85.9086 186.091 68 164 68ZM164 168H132V88H164C175.046 88 184 96.9543 184 108V148C184 159.046 175.046 168 164 168Z"
        fill="white"
      ></path>
    </svg>
  ),
};
