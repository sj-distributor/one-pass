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

const IconWarn: FunctionComponent<Props> = ({ size = 20, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M512 85.333a426.667 426.667 0 1 0 0 853.334 426.667 426.667 0 0 0 0-853.334z m-42.667 256a42.667 42.667 0 1 1 85.334 0V512a42.667 42.667 0 1 1-85.334 0V341.333z m42.667 384A42.667 42.667 0 1 1 512 640a42.667 42.667 0 0 1 0 85.333z"
        fill={getIconColor(color, 0, '#333333')}
      />
    </svg>
  );
};

export default IconWarn;
