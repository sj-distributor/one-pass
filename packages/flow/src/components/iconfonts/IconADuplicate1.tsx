/* tslint:disable */
/* eslint-disable */

import { CSSProperties, SVGAttributes, FunctionComponent } from "react";
import { getIconColor } from "./helper";
import React from "react";

interface Props extends Omit<SVGAttributes<SVGElement>, "color"> {
  size?: number;
  color?: string | string[];
}

const DEFAULT_STYLE: CSSProperties = {
  display: "block",
};

const IconADuplicate1: FunctionComponent<Props> = ({
  size = 20,
  color,
  style: _style,
  ...rest
}) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg
      viewBox="0 0 1024 1024"
      width={size + "px"}
      height={size + "px"}
      style={style}
      {...rest}
    >
      <path
        d="M722.901 134.485H168.235a42.667 42.667 0 0 0-42.667 42.667v554.667a42.667 42.667 0 0 0 42.667 42.666h39.168V255.573a42.667 42.667 0 0 1 42.666-42.666l515.499-1.067v-34.73a42.667 42.667 0 0 0-42.667-42.667z"
        fill={getIconColor(color, 0, "#BBB9CF")}
      />
      <path
        d="M311.893 272.512H866.56a42.667 42.667 0 0 1 42.667 42.667v554.666a42.667 42.667 0 0 1-42.667 42.667H311.893a42.667 42.667 0 0 1-42.666-42.667V315.18a42.667 42.667 0 0 1 42.666-42.667z"
        fill={getIconColor(color, 1, "#BBB9CF")}
      />
      <path
        d="M730.496 620.97H623.957v106.54c0 14.463-11.093 26.88-25.6 27.562a26.923 26.923 0 0 1-28.074-26.795V620.971H463.7a27.35 27.35 0 0 1-27.562-25.558 26.88 26.88 0 0 1 26.837-28.117h107.307V460.715c0-14.422 11.093-26.838 25.514-27.52a26.837 26.837 0 0 1 28.16 26.794v107.307h107.307a26.837 26.837 0 0 1 26.837 28.16 27.392 27.392 0 0 1-27.605 25.515z"
        fill={getIconColor(color, 2, "#FFFFFF")}
      />
    </svg>
  );
};

export default IconADuplicate1;
