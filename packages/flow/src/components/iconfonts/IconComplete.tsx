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

const IconComplete: FunctionComponent<Props> = ({ size = 20, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M938.667 512c0 235.648-191.019 426.667-426.667 426.667S85.333 747.648 85.333 512 276.352 85.333 512 85.333 938.667 276.352 938.667 512zM418.005 680.875a37.077 37.077 0 0 0 51.371 0l253.739-250.326a35.157 35.157 0 0 0 0-50.474 36.907 36.907 0 0 0-51.414 0L443.52 605.269l-91.221-88.405a36.907 36.907 0 0 0-51.371 0 35.2 35.2 0 0 0-7.979 38.997 35.499 35.499 0 0 0 7.979 11.52l117.077 113.494z"
        fill={getIconColor(color, 0, '#333333')}
      />
    </svg>
  );
};

export default IconComplete;
