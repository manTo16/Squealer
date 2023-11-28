// icon:24px | Material Design Icons https://material.io/resources/icons/ | Google
import * as React from "react";

export default function TagButton(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path fill="none" d="M0 0h24v24H0z" />
      <path d="M21 3H3c-1.1 0-2 .9-2 2v8h2V5h18v16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
      <path d="M13 10 A4 4 0 0 1 9 14 A4 4 0 0 1 5 10 A4 4 0 0 1 13 10 z" />
      <path d="M15.39 16.56C13.71 15.7 11.53 15 9 15s-4.71.7-6.39 1.56A2.97 2.97 0 001 19.22V22h16v-2.78c0-1.12-.61-2.15-1.61-2.66z" />
    </svg>
  );
}


