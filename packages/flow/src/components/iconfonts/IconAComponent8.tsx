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

const IconAComponent8: FunctionComponent<Props> = ({
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
        d="M512 0q512 0 512 512t-512 512Q0 1024 0 512T512 0z"
        fill={getIconColor(color, 0, "#8F86F4")}
      />
      <path
        d="M469.312 341.312a64 64 0 1 0 0 128 64 64 0 0 0 0-128z m-106.656 64a106.656 106.656 0 1 1 213.344 0 106.656 106.656 0 0 1-213.344 0z m21.344 192a64 64 0 0 0-64 64c0 11.808 9.536 21.344 21.312 21.344h256a21.344 21.344 0 0 0 21.344-21.344 64 64 0 0 0-64-64H384z m-106.688 64A106.656 106.656 0 0 1 384 554.656h170.656a106.656 106.656 0 0 1 106.688 106.656 64 64 0 0 1-64 64h-256a64 64 0 0 1-64-64z m359.04-277.632a64.064 64.064 0 0 1-23.232 73.92 37.504 37.504 0 0 0-6.496 5.856c-5.856 6.656-9.088 15.296-6.592 23.808 3.328 11.264 15.296 17.92 25.696 12.416a106.368 106.368 0 0 0 35.648-30.4l0.064-0.096a106.656 106.656 0 0 0 11.616-108.064v-0.096a105.696 105.696 0 0 0-28.384-37.312c-8.992-7.584-22.112-3.648-27.744 6.688-4.256 7.744-2.912 16.896 1.376 24.64a37.311 37.311 0 0 0 5.088 7.104 64.064 64.064 0 0 1 12.96 21.536z m71.488 248.736a64.32 64.32 0 0 0-17.6-32.832 37.504 37.504 0 0 1-5.44-6.848c-4.64-7.52-6.4-16.608-2.528-24.544 5.12-10.56 18.048-15.136 27.392-8a105.792 105.792 0 0 1 30.112 35.904l0.032 0.096a106.656 106.656 0 0 1 11.488 57.408v0.096a106.976 106.976 0 0 1-14.016 44.736c-5.888 10.176-19.552 10.912-28.352 3.136-6.624-5.856-8.512-14.912-7.104-23.68 0.448-2.88 1.28-5.696 2.368-8.384a64.32 64.32 0 0 0 3.648-37.088z"
        fill={getIconColor(color, 1, "#FFFFFF")}
      />
    </svg>
  );
};

export default IconAComponent8;
