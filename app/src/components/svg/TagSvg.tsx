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
      <path d="M21.842 6.218a1.977 1.977 0 00-.424-.628A1.99 1.99 0 0020 5H8c-.297 0-.578.132-.769.359l-5 6c-.309.371-.309.91 0 1.281l5 6c.191.228.472.36.769.36h12a1.977 1.977 0 001.41-.582A1.99 1.99 0 0022 17V7c0-.266-.052-.525-.158-.782z" />
    </svg>
  );
}


