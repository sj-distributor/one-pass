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

const IconPlus: FunctionComponent<Props> = ({ size = 20, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M128 512a42.667 42.667 0 0 1 42.667-42.667H459.86V180.14a42.667 42.667 0 1 1 85.334 0v289.194h289.194a42.667 42.667 0 0 1 0 85.334H545.195V843.86a42.667 42.667 0 1 1-85.334 0V554.667H170.667A42.667 42.667 0 0 1 128 512z"
        fill={getIconColor(color, 0, '#333333')}
      />
    </svg>
  );
};

export default IconPlus;
