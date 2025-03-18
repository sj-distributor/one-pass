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

const IconDown: FunctionComponent<Props> = ({ size = 20, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M267.264 375.893a38.485 38.485 0 0 1 54.443 0l190.506 190.55 190.55-190.55a38.485 38.485 0 0 1 54.442 54.443l-217.77 217.77a38.485 38.485 0 0 1-54.4 0l-217.771-217.77a38.485 38.485 0 0 1 0-54.443z"
        fill={getIconColor(color, 0, '#333333')}
      />
    </svg>
  );
};

export default IconDown;
