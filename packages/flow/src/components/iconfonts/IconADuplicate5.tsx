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

const IconADuplicate5: FunctionComponent<Props> = ({
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
        d="M710.536 156.672h-522.06a40.177 40.177 0 0 0-40.177 40.177v522.06a40.177 40.177 0 0 0 40.177 40.116h36.864V270.697a40.177 40.177 0 0 1 40.117-40.177l485.195-0.963v-32.708a40.117 40.117 0 0 0-40.116-40.177zM323.704 286.6h522a40.177 40.177 0 0 1 40.176 40.116v522.06a40.177 40.177 0 0 1-40.176 40.176h-522a40.177 40.177 0 0 1-40.176-40.176v-522.06a40.177 40.177 0 0 1 40.176-40.116z m293.648 327.98h100.291c13.613 0 25.3-10.48 25.962-24.093a25.299 25.299 0 0 0-25.3-26.444H617.413V463.03a25.299 25.299 0 0 0-26.504-25.239 25.72 25.72 0 0 0-23.973 25.901v100.352H465.86a25.299 25.299 0 0 0-25.3 26.504c0.724 13.553 12.41 24.034 25.962 24.034h100.352v100.954a25.239 25.239 0 0 0 26.444 25.299 25.72 25.72 0 0 0 24.034-25.962V614.581z"
        fill={getIconColor(color, 0, "#FFFFFF")}
      />
    </svg>
  );
};

export default IconADuplicate5;
