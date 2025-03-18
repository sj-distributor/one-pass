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

const IconAdd: FunctionComponent<Props> = ({
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
        d="M512 83.804c-226.1 0-409.6 183.501-409.6 409.6s183.5 409.6 409.6 409.6 409.6-183.5 409.6-409.6-183.5-409.6-409.6-409.6z m163.84 450.56H552.96v122.88c0 22.528-18.432 40.96-40.96 40.96s-40.96-18.432-40.96-40.96v-122.88H348.16c-22.528 0-40.96-18.432-40.96-40.96s18.432-40.96 40.96-40.96h122.88v-122.88c0-22.528 18.432-40.96 40.96-40.96s40.96 18.432 40.96 40.96v122.88h122.88c22.528 0 40.96 18.432 40.96 40.96s-18.432 40.96-40.96 40.96z"
        fill={getIconColor(color, 0, "#333333")}
      />
    </svg>
  );
};

export default IconAdd;
