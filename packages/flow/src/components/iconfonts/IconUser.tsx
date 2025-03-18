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

const IconUser: FunctionComponent<Props> = ({ size = 20, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M512 160a160 160 0 1 0 0 320 160 160 0 0 0 0-320zM341.333 565.333a160 160 0 0 0-160 160v50.688c0 32.171 23.296 59.563 55.04 64.726a1709.37 1709.37 0 0 0 551.254 0 65.579 65.579 0 0 0 55.04-64.726v-50.688a160 160 0 0 0-160-160H668.16c-7.893 0-15.744 1.28-23.21 3.67L608 581.077a309.376 309.376 0 0 1-192 0l-36.95-12.074a74.667 74.667 0 0 0-23.167-3.67h-14.55z"
        fill={getIconColor(color, 0, '#333333')}
      />
    </svg>
  );
};

export default IconUser;
