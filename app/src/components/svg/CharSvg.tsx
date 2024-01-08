// icon:type | Feathericons https://feathericons.com/ | Cole Bemis
import * as React from "react";

export default function Char(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      viewBox="0 0 24 24"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M4 7V4h16v3M9 20h6M12 4v16" />
    </svg>
  );
}