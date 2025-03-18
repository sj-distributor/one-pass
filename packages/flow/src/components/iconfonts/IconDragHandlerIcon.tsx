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

const IconDragHandlerIcon: FunctionComponent<Props> = ({ size = 20, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M426.667 384a42.667 42.667 0 1 0 0-85.333 42.667 42.667 0 0 0 0 85.333z m170.666 0a42.667 42.667 0 1 0 0-85.333 42.667 42.667 0 0 0 0 85.333zM426.667 725.333a42.667 42.667 0 1 0 0-85.333 42.667 42.667 0 0 0 0 85.333z m170.666 0a42.667 42.667 0 1 0 0-85.333 42.667 42.667 0 0 0 0 85.333zM426.667 554.667a42.667 42.667 0 1 0 0-85.334 42.667 42.667 0 0 0 0 85.334z m170.666 0a42.667 42.667 0 1 0 0-85.334 42.667 42.667 0 0 0 0 85.334z"
        fill={getIconColor(color, 0, '#333333')}
      />
    </svg>
  );
};

export default IconDragHandlerIcon;
