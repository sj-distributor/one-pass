/* tslint:disable */
/* eslint-disable */

import { CSSProperties, SVGAttributes, FunctionComponent } from 'react';
import { getIconColor } from './helper';
import React from 'react';

interface Props extends Omit<SVGAttributes<SVGElement>, 'color'> {
  size?: number;
  color?: string | string[];
}

const DEFAULT_STYLE: CSSProperties = {
  display: 'block',
};

const IconSignOutIcon: FunctionComponent<Props> = ({ size = 20, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M552.32 228.992a39.872 39.872 0 0 0-40.32-39.36 39.872 39.872 0 0 0-40.32 39.36v445.184a39.872 39.872 0 0 0 40.32 39.36 39.936 39.936 0 0 0 40.32-39.36V228.992z"
        fill={getIconColor(color, 0, '#333333')}
      />
      <path
        d="M660.864 279.552L541.76 161.408a42.496 42.496 0 0 0-59.52 0L363.072 279.552a41.664 41.664 0 0 0 29.824 71.296 42.304 42.304 0 0 0 29.76-12.224l89.28-88.576 89.408 88.576a42.304 42.304 0 0 0 68.672-13.568 41.728 41.728 0 0 0-9.152-45.504zM874.752 512h-80.64v282.112H229.888V512.064h-80.64v282.368c0 44.288 36.032 80.32 80.448 80.32h564.672a80.32 80.32 0 0 0 80.384-80.32V512z"
        fill={getIconColor(color, 1, '#333333')}
      />
    </svg>
  );
};

export default IconSignOutIcon;
