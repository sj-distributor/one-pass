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

const IconAOmeForm7: FunctionComponent<Props> = ({ size = 20, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M512 64a448 448 0 1 0 0 896 448 448 0 0 0 0-896z m0 820.032a372.032 372.032 0 0 1 0-744.064 372.032 372.032 0 0 1 0 744.064z"
        fill={getIconColor(color, 0, '#333333')}
      />
      <path
        d="M464 336a48 48 0 1 0 96 0 48 48 0 0 0-96 0z m72 112h-48a8 8 0 0 0-8 8v272c0 4.416 3.584 8 8 8h48a8 8 0 0 0 8-8V456a8 8 0 0 0-8-8z"
        fill={getIconColor(color, 1, '#333333')}
      />
    </svg>
  );
};

export default IconAOmeForm7;
