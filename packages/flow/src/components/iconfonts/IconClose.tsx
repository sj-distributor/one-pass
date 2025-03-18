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

const IconClose: FunctionComponent<Props> = ({ size = 20, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M268.501 268.501a42.667 42.667 0 0 1 60.331 0l204.501 204.502L737.835 268.5a42.667 42.667 0 1 1 60.33 60.331L593.664 533.333l204.501 204.502a42.667 42.667 0 0 1-60.33 60.33L533.333 593.664 328.832 798.165a42.667 42.667 0 0 1-60.33-60.33l204.5-204.502-204.5-204.501a42.667 42.667 0 0 1 0-60.33z"
        fill={getIconColor(color, 0, '#333333')}
      />
    </svg>
  );
};

export default IconClose;
