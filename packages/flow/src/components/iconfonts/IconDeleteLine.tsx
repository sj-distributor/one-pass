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

const IconDeleteLine: FunctionComponent<Props> = ({ size = 20, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M348.078 173.67h-8.602c4.71 0 8.602-3.89 8.602-8.642v8.601h327.844v-8.601c0 4.751 3.891 8.601 8.602 8.601h-8.602v77.66h77.62v-86.261c0-38.093-30.926-69.018-69.018-69.018H339.436c-38.052 0-69.018 30.925-69.018 69.018v86.262h77.66v-77.66z m543.54 77.62H132.341a34.488 34.488 0 0 0-34.489 34.529v34.488c0 4.752 3.892 8.602 8.602 8.602h65.126l26.665 564.019a69.059 69.059 0 0 0 68.895 65.782h489.595c36.864 0 67.174-28.877 68.936-65.782l26.624-564.02h65.126c4.751 0 8.643-3.85 8.643-8.6v-34.49a34.488 34.488 0 0 0-34.53-34.528z m-143.115 629.8H275.497l-26.05-552.181h525.189l-26.092 552.14z"
        fill={getIconColor(color, 0, '#333333')}
      />
    </svg>
  );
};

export default IconDeleteLine;
