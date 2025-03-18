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

const IconAOmeIconDepartmentIcon: FunctionComponent<Props> = ({ size = 20, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M469.333 213.333v85.334h85.334v-85.334h-85.334z m0 256V384h-42.666A42.667 42.667 0 0 1 384 341.333V170.667A42.667 42.667 0 0 1 426.667 128h170.666A42.667 42.667 0 0 1 640 170.667v170.666A42.667 42.667 0 0 1 597.333 384h-42.666v85.333H768A42.667 42.667 0 0 1 810.667 512v128h42.666A42.667 42.667 0 0 1 896 682.667v170.666A42.667 42.667 0 0 1 853.333 896H682.667A42.667 42.667 0 0 1 640 853.333V682.667A42.667 42.667 0 0 1 682.667 640h42.666v-85.333H298.667V640h42.666A42.667 42.667 0 0 1 384 682.667v170.666A42.667 42.667 0 0 1 341.333 896H170.667A42.667 42.667 0 0 1 128 853.333V682.667A42.667 42.667 0 0 1 170.667 640h42.666V512A42.667 42.667 0 0 1 256 469.333h213.333z m-256 256v85.334h85.334v-85.334h-85.334z m512 0v85.334h85.334v-85.334h-85.334z"
        fill={getIconColor(color, 0, '#333333')}
      />
    </svg>
  );
};

export default IconAOmeIconDepartmentIcon;
