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

const IconAInfo2: FunctionComponent<Props> = ({ size = 20, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M471.04 342.59a40.96 40.96 0 1 0 81.92 0 40.96 40.96 0 0 0-81.92 0zM512 834.11c-180.634 0-327.68-147.047-327.68-327.68S331.366 178.75 512 178.75s327.68 147.046 327.68 327.68S692.634 834.11 512 834.11z m0-737.28a409.6 409.6 0 1 0 0 819.2 409.6 409.6 0 0 0 0-819.2z m-40.96 573.44a40.96 40.96 0 1 0 81.92 0V506.43a40.96 40.96 0 1 0-81.92 0v163.84z"
        fill={getIconColor(color, 0, '#333333')}
      />
    </svg>
  );
};

export default IconAInfo2;
