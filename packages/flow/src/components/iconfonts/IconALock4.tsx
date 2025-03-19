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

const IconALock4: FunctionComponent<Props> = ({ size = 20, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M128 512a128 128 0 0 1 128-128h512a128 128 0 0 1 128 128v298.667a128 128 0 0 1-128 128H256a128 128 0 0 1-128-128V512z m426.667 85.333a42.667 42.667 0 0 0-85.334 0v128a42.667 42.667 0 0 0 85.334 0v-128z"
        fill={getIconColor(color, 0, '#333333')}
      />
      <path
        d="M512 170.667a128 128 0 0 0-128 128v128a42.667 42.667 0 1 1-85.333 0v-128a213.333 213.333 0 1 1 426.666 0v128a42.667 42.667 0 1 1-85.333 0v-128a128 128 0 0 0-128-128z"
        fill={getIconColor(color, 1, '#333333')}
      />
    </svg>
  );
};

export default IconALock4;
