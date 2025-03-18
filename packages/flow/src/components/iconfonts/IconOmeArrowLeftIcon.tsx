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

const IconOmeArrowLeftIcon: FunctionComponent<Props> = ({ size = 20, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M520.479 257.761a40.96 40.96 0 0 1 0 57.918L365.117 471.04H757.76a40.96 40.96 0 0 1 0 81.92H365.117L520.48 708.321a40.96 40.96 0 1 1-57.959 57.918l-225.239-225.28a40.837 40.837 0 0 1-12.001-27.853v-2.294a40.796 40.796 0 0 1 12.001-27.77l225.24-225.28a40.96 40.96 0 0 1 57.958 0z"
        fill={getIconColor(color, 0, '#333333')}
      />
    </svg>
  );
};

export default IconOmeArrowLeftIcon;
