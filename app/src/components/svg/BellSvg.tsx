// icon:24px | Material Design Icons https://material.io/resources/icons/ | Google
import * as React from "react";

function Bell(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        height="1em"
        width="1em"
        {...props}
        >
        <path fill="none" d="M0 0h24v24H0V0z" />
        <path d="M10.01 21.01c0 1.1.89 1.99 1.99 1.99s1.99-.89 1.99-1.99h-3.98zm8.87-4.19V11c0-3.25-2.25-5.97-5.29-6.69v-.72C13.59 2.71 12.88 2 12 2s-1.59.71-1.59 1.59v.72A6.873 6.873 0 005.12 11v5.82L3 18.94V20h18v-1.06l-2.12-2.12zM16 13.01h-3v3h-2v-3H8V11h3V8h2v3h3v2.01z" />
        </svg>
    );
    }
  
  export default Bell;