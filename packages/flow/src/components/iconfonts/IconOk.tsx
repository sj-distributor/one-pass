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

const IconOk: FunctionComponent<Props> = ({ size = 20, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M880.085 271.957a54.443 54.443 0 0 1 0 76.971L472.107 756.864a58.027 58.027 0 0 1-82.134 0L187.307 554.197a54.443 54.443 0 1 1 76.928-76.928l166.784 166.784 372.053-372.096a54.443 54.443 0 0 1 77.013 0z"
        fill={getIconColor(color, 0, '#333333')}
      />
    </svg>
  );
};

export default IconOk;
